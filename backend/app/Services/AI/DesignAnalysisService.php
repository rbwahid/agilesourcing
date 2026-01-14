<?php

namespace App\Services\AI;

use App\Models\Design;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use OpenAI\Laravel\Facades\OpenAI;

class DesignAnalysisService
{
    /**
     * The system prompt for design analysis.
     */
    private const SYSTEM_PROMPT = <<<'PROMPT'
You are an expert fashion design analyst specializing in trend forecasting, style analysis, and market positioning. Analyze the provided fashion design image and return a detailed JSON analysis.

Your response MUST be a valid JSON object with exactly this structure:
{
  "keywords": ["string array of 5-8 style keywords"],
  "style_tags": ["string array of 3-5 style category tags"],
  "color_palette": ["array of hex color codes extracted from the design"],
  "dominant_color": "hex code of the most prominent color",
  "color_mood": "string describing the overall color mood",
  "suggested_materials": ["array of 3-5 recommended fabrics/materials"],
  "market_fit_score": 0-100,
  "market_fit_explanation": "brief explanation of market positioning",
  "target_audience": "description of ideal customer demographic",
  "trend_alignment": "explanation of how design aligns with current trends",
  "trend_score": 0-100,
  "seasonal_relevance": ["array of applicable seasons"],
  "production_complexity": "low|medium|high",
  "estimated_price_point": "budget|mid-range|premium|luxury"
}

Provide accurate, professional analysis based on current fashion industry standards.
PROMPT;

    /**
     * Analyze a design using GPT-4o Vision.
     *
     * @param  Design  $design  The design to analyze
     * @return array The analysis result
     *
     * @throws \Exception If analysis fails
     */
    public function analyzeDesign(Design $design): array
    {
        Log::info('Starting AI analysis for design', ['design_id' => $design->id]);

        // Get the image URL or base64 encoded content
        $imageContent = $this->getImageContent($design);

        try {
            $response = OpenAI::chat()->create([
                'model' => config('openai.model', 'gpt-4o'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => self::SYSTEM_PROMPT,
                    ],
                    [
                        'role' => 'user',
                        'content' => [
                            [
                                'type' => 'text',
                                'text' => $this->buildUserPrompt($design),
                            ],
                            [
                                'type' => 'image_url',
                                'image_url' => [
                                    'url' => $imageContent,
                                    'detail' => 'high',
                                ],
                            ],
                        ],
                    ],
                ],
                'max_tokens' => 2000,
                'temperature' => 0.7,
                'response_format' => ['type' => 'json_object'],
            ]);

            $content = $response->choices[0]->message->content;
            $analysis = json_decode($content, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Failed to parse AI response as JSON');
            }

            Log::info('AI analysis completed successfully', [
                'design_id' => $design->id,
                'trend_score' => $analysis['trend_score'] ?? null,
            ]);

            return $this->validateAndNormalizeAnalysis($analysis);
        } catch (\Exception $e) {
            Log::error('AI analysis failed', [
                'design_id' => $design->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Get image content as base64 data URL.
     */
    private function getImageContent(Design $design): string
    {
        $filePath = $design->file_path;

        if (! Storage::disk('private')->exists($filePath)) {
            throw new \Exception("Design file not found: {$filePath}");
        }

        $content = Storage::disk('private')->get($filePath);
        $mimeType = Storage::disk('private')->mimeType($filePath);

        return 'data:'.$mimeType.';base64,'.base64_encode($content);
    }

    /**
     * Build the user prompt with design context.
     */
    private function buildUserPrompt(Design $design): string
    {
        $prompt = "Analyze this fashion design image and provide a comprehensive analysis.\n\n";
        $prompt .= "Design Information:\n";
        $prompt .= "- Title: {$design->title}\n";

        if ($design->description) {
            $prompt .= "- Designer's Description: {$design->description}\n";
        }

        if ($design->category) {
            $prompt .= "- Category: {$design->category}\n";
        }

        if ($design->season) {
            $prompt .= "- Intended Season: {$design->season}\n";
        }

        if ($design->target_demographic) {
            $prompt .= "- Target Demographic: {$design->target_demographic}\n";
        }

        $prompt .= "\nProvide your analysis as a JSON object following the exact structure specified.";

        return $prompt;
    }

    /**
     * Validate and normalize the analysis result.
     */
    private function validateAndNormalizeAnalysis(array $analysis): array
    {
        // Ensure required fields exist with defaults
        $defaults = [
            'keywords' => [],
            'style_tags' => [],
            'color_palette' => [],
            'dominant_color' => '#000000',
            'color_mood' => 'neutral',
            'suggested_materials' => [],
            'market_fit_score' => 50,
            'market_fit_explanation' => '',
            'target_audience' => '',
            'trend_alignment' => '',
            'trend_score' => 50,
            'seasonal_relevance' => [],
            'production_complexity' => 'medium',
            'estimated_price_point' => 'mid-range',
        ];

        $result = array_merge($defaults, $analysis);

        // Ensure scores are within valid range
        $result['market_fit_score'] = max(0, min(100, (int) $result['market_fit_score']));
        $result['trend_score'] = max(0, min(100, (int) $result['trend_score']));

        // Ensure arrays are actually arrays
        foreach (['keywords', 'style_tags', 'color_palette', 'suggested_materials', 'seasonal_relevance'] as $field) {
            if (! is_array($result[$field])) {
                $result[$field] = [];
            }
        }

        // Validate production complexity
        $validComplexities = ['low', 'medium', 'high'];
        if (! in_array($result['production_complexity'], $validComplexities)) {
            $result['production_complexity'] = 'medium';
        }

        // Validate price point
        $validPricePoints = ['budget', 'mid-range', 'premium', 'luxury'];
        if (! in_array($result['estimated_price_point'], $validPricePoints)) {
            $result['estimated_price_point'] = 'mid-range';
        }

        return $result;
    }
}
