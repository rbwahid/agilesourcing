<?php

namespace App\Providers;

use App\Listeners\LogNotificationSent;
use App\Listeners\StripeEventListener;
use App\Models\Conversation;
use App\Models\Design;
use App\Models\Message;
use App\Policies\ConversationPolicy;
use App\Policies\DesignPolicy;
use App\Policies\MessagePolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Events\NotificationSent;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Cashier\Events\WebhookReceived;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureRateLimiting();
        $this->registerStripeEventListeners();
        $this->registerNotificationListeners();
        $this->registerPolicies();
    }

    /**
     * Register authorization policies.
     */
    protected function registerPolicies(): void
    {
        Gate::policy(Design::class, DesignPolicy::class);
        Gate::policy(Conversation::class, ConversationPolicy::class);
        Gate::policy(Message::class, MessagePolicy::class);
    }

    /**
     * Register Stripe webhook event listeners.
     */
    protected function registerStripeEventListeners(): void
    {
        Event::listen(WebhookReceived::class, StripeEventListener::class);
    }

    /**
     * Register notification event listeners for logging.
     */
    protected function registerNotificationListeners(): void
    {
        Event::listen(NotificationSent::class, LogNotificationSent::class);
    }

    /**
     * Configure rate limiters for the application.
     */
    protected function configureRateLimiting(): void
    {
        // Strict rate limiting for login attempts (5 per minute per IP+email combo)
        RateLimiter::for('login', function (Request $request) {
            $key = $request->input('email', 'guest').'|'.$request->ip();

            return Limit::perMinute(5)
                ->by($key)
                ->response(function (Request $request, array $headers) {
                    $retryAfter = $headers['Retry-After'] ?? 60;

                    return response()->json([
                        'message' => 'Too many login attempts. Please try again in '.ceil($retryAfter / 60).' minute(s).',
                        'retry_after' => $retryAfter,
                    ], 429, $headers);
                });
        });

        // Rate limiting for registration (3 per hour per IP)
        RateLimiter::for('register', function (Request $request) {
            return Limit::perHour(3)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message' => 'Too many registration attempts. Please try again later.',
                        'retry_after' => $headers['Retry-After'] ?? 3600,
                    ], 429, $headers);
                });
        });

        // Rate limiting for password reset requests (3 per hour per IP)
        RateLimiter::for('password-reset', function (Request $request) {
            return Limit::perHour(3)
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'message' => 'Too many password reset attempts. Please try again later.',
                        'retry_after' => $headers['Retry-After'] ?? 3600,
                    ], 429, $headers);
                });
        });

        // General API rate limiting (60 per minute)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
