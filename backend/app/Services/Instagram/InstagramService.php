<?php

namespace App\Services\Instagram;

use App\Models\InstagramConnection;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InstagramService
{
    /**
     * Instagram Graph API base URL.
     */
    private const GRAPH_URL = 'https://graph.facebook.com';

    /**
     * Required OAuth scopes for Instagram Business/Creator accounts.
     */
    public const SCOPES = [
        'instagram_basic',
        'instagram_content_publish',
        'instagram_manage_insights',
        'pages_read_engagement',
        'pages_show_list',
    ];

    /**
     * Get the OAuth authorization URL.
     */
    public function getAuthUrl(string $state): string
    {
        $params = [
            'client_id' => config('services.instagram.client_id'),
            'redirect_uri' => config('services.instagram.redirect'),
            'scope' => implode(',', self::SCOPES),
            'response_type' => 'code',
            'state' => $state,
        ];

        return 'https://www.facebook.com/'.config('services.instagram.graph_version').'/dialog/oauth?'.http_build_query($params);
    }

    /**
     * Exchange authorization code for access token.
     */
    public function exchangeCodeForToken(string $code): array
    {
        $response = $this->graphRequest()->post('/oauth/access_token', [
            'client_id' => config('services.instagram.client_id'),
            'client_secret' => config('services.instagram.client_secret'),
            'redirect_uri' => config('services.instagram.redirect'),
            'code' => $code,
        ]);

        if ($response->failed()) {
            Log::error('Instagram token exchange failed', [
                'error' => $response->json(),
            ]);
            throw new \Exception('Failed to exchange code for token: '.($response->json('error.message') ?? 'Unknown error'));
        }

        $data = $response->json();

        // Exchange short-lived token for long-lived token
        return $this->getLongLivedToken($data['access_token']);
    }

    /**
     * Exchange short-lived token for long-lived token (60 days).
     */
    public function getLongLivedToken(string $shortLivedToken): array
    {
        $response = $this->graphRequest()->get('/oauth/access_token', [
            'grant_type' => 'fb_exchange_token',
            'client_id' => config('services.instagram.client_id'),
            'client_secret' => config('services.instagram.client_secret'),
            'fb_exchange_token' => $shortLivedToken,
        ]);

        if ($response->failed()) {
            Log::error('Instagram long-lived token exchange failed', [
                'error' => $response->json(),
            ]);
            throw new \Exception('Failed to get long-lived token');
        }

        $data = $response->json();

        return [
            'access_token' => $data['access_token'],
            'expires_in' => $data['expires_in'] ?? 5184000, // Default 60 days
        ];
    }

    /**
     * Refresh an expiring long-lived token.
     */
    public function refreshToken(InstagramConnection $connection): bool
    {
        try {
            $response = $this->graphRequest()->get('/oauth/access_token', [
                'grant_type' => 'fb_exchange_token',
                'client_id' => config('services.instagram.client_id'),
                'client_secret' => config('services.instagram.client_secret'),
                'fb_exchange_token' => $connection->access_token,
            ]);

            if ($response->failed()) {
                Log::error('Instagram token refresh failed', [
                    'connection_id' => $connection->id,
                    'error' => $response->json(),
                ]);

                return false;
            }

            $data = $response->json();

            $connection->update([
                'access_token' => $data['access_token'],
                'token_expires_at' => now()->addSeconds($data['expires_in'] ?? 5184000),
            ]);

            Log::info('Instagram token refreshed', [
                'connection_id' => $connection->id,
                'expires_at' => $connection->token_expires_at,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Instagram token refresh exception', [
                'connection_id' => $connection->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Get the connected Instagram Business account profile.
     */
    public function getProfile(string $accessToken): array
    {
        // First get Facebook Pages
        $pagesResponse = $this->graphRequest()->get('/me/accounts', [
            'access_token' => $accessToken,
            'fields' => 'id,name,instagram_business_account',
        ]);

        if ($pagesResponse->failed()) {
            throw new \Exception('Failed to get Facebook pages');
        }

        $pages = $pagesResponse->json('data', []);

        // Find page with Instagram Business account
        $instagramAccount = null;
        foreach ($pages as $page) {
            if (isset($page['instagram_business_account'])) {
                $instagramAccountId = $page['instagram_business_account']['id'];

                // Get Instagram account details
                $igResponse = $this->graphRequest()->get("/{$instagramAccountId}", [
                    'access_token' => $accessToken,
                    'fields' => 'id,username,profile_picture_url,followers_count,media_count',
                ]);

                if ($igResponse->successful()) {
                    $instagramAccount = $igResponse->json();
                    break;
                }
            }
        }

        if (! $instagramAccount) {
            throw new \Exception('No Instagram Business account found. Please connect a Facebook Page with an Instagram Business/Creator account.');
        }

        return [
            'instagram_user_id' => $instagramAccount['id'],
            'instagram_username' => $instagramAccount['username'],
            'profile_picture_url' => $instagramAccount['profile_picture_url'] ?? null,
            'followers_count' => $instagramAccount['followers_count'] ?? 0,
            'media_count' => $instagramAccount['media_count'] ?? 0,
        ];
    }

    /**
     * Publish an image to Instagram.
     *
     * Instagram Graph API requires a 2-step process:
     * 1. Create a container with the image URL
     * 2. Publish the container
     */
    public function publishMedia(string $accessToken, string $instagramUserId, string $imageUrl, string $caption): array
    {
        Log::info('Publishing to Instagram', [
            'instagram_user_id' => $instagramUserId,
            'caption_length' => strlen($caption),
        ]);

        // Step 1: Create media container
        $containerResponse = $this->graphRequest()->post("/{$instagramUserId}/media", [
            'access_token' => $accessToken,
            'image_url' => $imageUrl,
            'caption' => $caption,
        ]);

        if ($containerResponse->failed()) {
            $error = $containerResponse->json('error.message', 'Unknown error');
            Log::error('Instagram container creation failed', [
                'error' => $containerResponse->json(),
            ]);
            throw new \Exception("Failed to create media container: {$error}");
        }

        $containerId = $containerResponse->json('id');

        // Wait for container to be ready (Instagram processes the image)
        $this->waitForContainerReady($accessToken, $containerId);

        // Step 2: Publish the container
        $publishResponse = $this->graphRequest()->post("/{$instagramUserId}/media_publish", [
            'access_token' => $accessToken,
            'creation_id' => $containerId,
        ]);

        if ($publishResponse->failed()) {
            $error = $publishResponse->json('error.message', 'Unknown error');
            Log::error('Instagram publish failed', [
                'container_id' => $containerId,
                'error' => $publishResponse->json(),
            ]);
            throw new \Exception("Failed to publish media: {$error}");
        }

        $mediaId = $publishResponse->json('id');

        // Get the permalink
        $mediaDetails = $this->getMediaDetails($accessToken, $mediaId);

        Log::info('Instagram publish successful', [
            'media_id' => $mediaId,
            'permalink' => $mediaDetails['permalink'] ?? null,
        ]);

        return [
            'media_id' => $mediaId,
            'permalink' => $mediaDetails['permalink'] ?? null,
        ];
    }

    /**
     * Wait for media container to be ready for publishing.
     */
    private function waitForContainerReady(string $accessToken, string $containerId, int $maxAttempts = 30): void
    {
        for ($i = 0; $i < $maxAttempts; $i++) {
            $response = $this->graphRequest()->get("/{$containerId}", [
                'access_token' => $accessToken,
                'fields' => 'status_code',
            ]);

            if ($response->successful()) {
                $status = $response->json('status_code');

                if ($status === 'FINISHED') {
                    return;
                }

                if ($status === 'ERROR') {
                    throw new \Exception('Media container processing failed');
                }
            }

            // Wait 1 second before checking again
            sleep(1);
        }

        throw new \Exception('Timeout waiting for media container to be ready');
    }

    /**
     * Get media details including permalink.
     */
    public function getMediaDetails(string $accessToken, string $mediaId): array
    {
        $response = $this->graphRequest()->get("/{$mediaId}", [
            'access_token' => $accessToken,
            'fields' => 'id,permalink,timestamp,media_type,media_url',
        ]);

        if ($response->failed()) {
            return [];
        }

        return $response->json();
    }

    /**
     * Get media insights (engagement metrics).
     */
    public function getMediaInsights(string $accessToken, string $mediaId): array
    {
        $response = $this->graphRequest()->get("/{$mediaId}/insights", [
            'access_token' => $accessToken,
            'metric' => 'likes,comments,shares,saved,reach,impressions',
        ]);

        if ($response->failed()) {
            Log::warning('Failed to get media insights', [
                'media_id' => $mediaId,
                'error' => $response->json(),
            ]);

            return $this->getFallbackMetrics($accessToken, $mediaId);
        }

        $insights = $response->json('data', []);
        $metrics = [];

        foreach ($insights as $insight) {
            $metrics[$insight['name']] = $insight['values'][0]['value'] ?? 0;
        }

        return [
            'likes' => $metrics['likes'] ?? 0,
            'comments' => $metrics['comments'] ?? 0,
            'shares' => $metrics['shares'] ?? 0,
            'saves' => $metrics['saved'] ?? 0,
            'reach' => $metrics['reach'] ?? 0,
            'impressions' => $metrics['impressions'] ?? 0,
        ];
    }

    /**
     * Get fallback metrics from media object if insights API fails.
     */
    private function getFallbackMetrics(string $accessToken, string $mediaId): array
    {
        $response = $this->graphRequest()->get("/{$mediaId}", [
            'access_token' => $accessToken,
            'fields' => 'like_count,comments_count',
        ]);

        if ($response->failed()) {
            return [
                'likes' => 0,
                'comments' => 0,
                'shares' => 0,
                'saves' => 0,
                'reach' => 0,
                'impressions' => 0,
            ];
        }

        return [
            'likes' => $response->json('like_count', 0),
            'comments' => $response->json('comments_count', 0),
            'shares' => 0,
            'saves' => 0,
            'reach' => 0,
            'impressions' => 0,
        ];
    }

    /**
     * Create a graph API request instance.
     */
    private function graphRequest(): PendingRequest
    {
        return Http::baseUrl(self::GRAPH_URL.'/'.config('services.instagram.graph_version'))
            ->timeout(30);
    }
}
