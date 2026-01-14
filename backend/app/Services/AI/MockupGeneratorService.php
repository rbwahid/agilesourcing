<?php

namespace App\Services\AI;

use App\Models\Design;
use App\Models\Mockup;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MockupGeneratorService
{
    /**
     * Model type descriptions for prompt building.
     */
    private const MODEL_DESCRIPTIONS = [
        'female' => 'a stylish female model with elegant posture',
        'male' => 'a confident male model with modern style',
        'unisex' => 'a gender-neutral model with contemporary appeal',
    ];

    /**
     * Pose descriptions for prompt building.
     */
    private const POSE_DESCRIPTIONS = [
        'front' => 'standing facing the camera in a natural pose',
        'side' => 'in a profile view showing the garment silhouette',
        'back' => 'turned away showing the back of the garment',
        'action' => 'in a dynamic walking pose with natural movement',
    ];

    /**
     * Background descriptions for prompt building.
     */
    private const BACKGROUND_DESCRIPTIONS = [
        'studio' => 'in a clean white photography studio with professional lighting',
        'outdoor' => 'in a natural outdoor setting with soft daylight',
        'urban' => 'on a modern city street with architectural elements',
        'beach' => 'on a pristine beach with ocean in the background',
    ];

    /**
     * Generate a mockup for a design.
     */
    public function generateMockup(
        Design $design,
        string $modelType,
        string $pose,
        string $background,
        ?int $variationId = null
    ): Mockup {
        Log::info('Starting mockup generation', [
            'design_id' => $design->id,
            'model_type' => $modelType,
            'pose' => $pose,
            'background' => $background,
        ]);

        // Create mockup record with pending status
        $mockup = Mockup::create([
            'design_id' => $design->id,
            'design_variation_id' => $variationId,
            'model_type' => $modelType,
            'pose' => $pose,
            'background' => $background,
            'status' => 'pending',
        ]);

        return $mockup;
    }

    /**
     * Process the mockup generation (called from job).
     */
    public function processMockup(Mockup $mockup): void
    {
        try {
            $mockup->update(['status' => 'processing']);

            $design = $mockup->design;
            $prompt = $this->buildPrompt($design, $mockup);

            // Store the prompt for debugging
            $mockup->update(['generation_prompt' => $prompt]);

            // Generate image using DALL-E 3
            $imageUrl = $this->generateImage($prompt);

            // Download and store the image
            $filePath = $this->downloadAndStoreImage($imageUrl, $design->id, $mockup->id);

            $mockup->update([
                'file_path' => $filePath,
                'file_url' => route('files.serve', [
                    'type' => 'mockups',
                    'id' => $design->id,
                    'filename' => basename($filePath),
                ]),
                'status' => 'completed',
            ]);

            Log::info('Mockup generation completed', [
                'mockup_id' => $mockup->id,
                'file_path' => $filePath,
            ]);
        } catch (\Exception $e) {
            Log::error('Mockup generation failed', [
                'mockup_id' => $mockup->id,
                'error' => $e->getMessage(),
            ]);

            $mockup->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    /**
     * Build the prompt for DALL-E 3.
     */
    private function buildPrompt(Design $design, Mockup $mockup): string
    {
        $modelDesc = self::MODEL_DESCRIPTIONS[$mockup->model_type] ?? self::MODEL_DESCRIPTIONS['female'];
        $poseDesc = self::POSE_DESCRIPTIONS[$mockup->pose] ?? self::POSE_DESCRIPTIONS['front'];
        $bgDesc = self::BACKGROUND_DESCRIPTIONS[$mockup->background] ?? self::BACKGROUND_DESCRIPTIONS['studio'];

        // Get design analysis for better context
        $analysis = $design->ai_analysis_result ?? [];
        $styleTags = implode(', ', $analysis['style_tags'] ?? []);
        $colorPalette = implode(', ', array_slice($analysis['color_palette'] ?? [], 0, 3));
        $targetAudience = $analysis['target_audience'] ?? '';

        $prompt = "Professional high-fashion photography of {$modelDesc}, {$poseDesc}, {$bgDesc}. ";
        $prompt .= 'The model is wearing a fashion garment with the following characteristics: ';
        $prompt .= "{$design->title}. ";

        if ($design->description) {
            $prompt .= "{$design->description}. ";
        }

        if ($styleTags) {
            $prompt .= "Style: {$styleTags}. ";
        }

        if ($colorPalette) {
            $prompt .= "Color palette: {$colorPalette}. ";
        }

        if ($design->category) {
            $prompt .= "Category: {$design->category}. ";
        }

        if ($design->season) {
            $prompt .= "Season: {$design->season}. ";
        }

        $prompt .= 'Shot in editorial style with natural lighting, fashion magazine quality, ';
        $prompt .= 'high resolution, professional photography, no text or watermarks.';

        return $prompt;
    }

    /**
     * Generate image using OpenAI DALL-E 3.
     */
    private function generateImage(string $prompt): string
    {
        $response = Http::withToken(config('openai.api_key'))
            ->timeout(60)
            ->post('https://api.openai.com/v1/images/generations', [
                'model' => 'dall-e-3',
                'prompt' => $prompt,
                'n' => 1,
                'size' => '1024x1792', // Portrait orientation for fashion
                'quality' => 'hd',
                'style' => 'natural',
            ]);

        if ($response->failed()) {
            $error = $response->json('error.message', 'Unknown error');
            throw new \Exception("DALL-E API error: {$error}");
        }

        $imageUrl = $response->json('data.0.url');

        if (! $imageUrl) {
            throw new \Exception('No image URL returned from DALL-E');
        }

        return $imageUrl;
    }

    /**
     * Download image from URL and store it locally.
     */
    private function downloadAndStoreImage(string $imageUrl, int $designId, int $mockupId): string
    {
        $response = Http::timeout(30)->get($imageUrl);

        if ($response->failed()) {
            throw new \Exception('Failed to download generated image');
        }

        $filename = "mockup_{$mockupId}_".Str::random(8).'.png';
        $path = "mockups/{$designId}/{$filename}";

        Storage::disk('private')->put($path, $response->body());

        return $path;
    }
}
