<?php

namespace App\Services\AI;

use App\Models\Design;
use App\Models\DesignVariation;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Log;

class VariationGeneratorService
{
    /**
     * Generate design variations using Gemini.
     *
     * @param  Design  $design  The design to generate variations for
     * @param  int  $count  Number of variations to generate
     * @return array Array of created DesignVariation models
     *
     * @throws \Exception If generation fails
     */
    public function generateVariations(Design $design, int $count = 3): array
    {
        Log::info('Starting variation generation', [
            'design_id' => $design->id,
            'count' => $count,
        ]);

        // Ensure design has been analyzed
        if (! $design->isAnalysisComplete()) {
            throw new \Exception('Design must be analyzed before generating variations');
        }

        $analysis = $design->ai_analysis_result;
        if (empty($analysis)) {
            throw new \Exception('No analysis result available for design');
        }

        try {
            // Generate variation suggestions using Gemini
            $suggestions = $this->generateVariationSuggestions($design, $analysis, $count);

            // Create variation records
            $variations = [];
            foreach ($suggestions as $index => $suggestion) {
                $variation = DesignVariation::create([
                    'design_id' => $design->id,
                    'variation_number' => $index + 1,
                    'description' => $suggestion['description'],
                    'file_path' => null, // Image generation would require Imagen API
                    'ai_suggestions' => [
                        'color_changes' => $suggestion['color_changes'] ?? [],
                        'material_changes' => $suggestion['material_changes'] ?? [],
                        'style_modifications' => $suggestion['style_modifications'] ?? [],
                        'target_market_shift' => $suggestion['target_market_shift'] ?? '',
                        'rationale' => $suggestion['rationale'] ?? '',
                        'estimated_appeal_increase' => $suggestion['estimated_appeal_increase'] ?? 0,
                    ],
                ]);

                $variations[] = $variation;
            }

            Log::info('Variation generation completed', [
                'design_id' => $design->id,
                'variations_created' => count($variations),
            ]);

            return $variations;
        } catch (\Exception $e) {
            Log::error('Variation generation failed', [
                'design_id' => $design->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Generate variation suggestions using Gemini.
     */
    private function generateVariationSuggestions(Design $design, array $analysis, int $count): array
    {
        $prompt = $this->buildVariationPrompt($design, $analysis, $count);

        $response = Gemini::generativeModel(config('gemini.model', 'gemini-2.0-flash'))
            ->withSystemInstruction($this->getSystemInstruction())
            ->generateContent($prompt);

        $content = $response->text();

        // Extract JSON from the response
        $json = $this->extractJsonFromResponse($content);
        $suggestions = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE || ! isset($suggestions['variations'])) {
            throw new \Exception('Failed to parse Gemini response as valid JSON');
        }

        return array_slice($suggestions['variations'], 0, $count);
    }

    /**
     * Get the system instruction for Gemini.
     */
    private function getSystemInstruction(): string
    {
        return <<<'INSTRUCTION'
You are a creative fashion design consultant specializing in generating innovative design variations. Your role is to suggest compelling variations of fashion designs that:

1. Maintain the core aesthetic DNA while exploring new possibilities
2. Consider market trends and consumer preferences
3. Provide practical, actionable suggestions for designers
4. Balance creativity with commercial viability

Always respond with valid JSON following the exact structure requested.
INSTRUCTION;
    }

    /**
     * Build the prompt for variation generation.
     */
    private function buildVariationPrompt(Design $design, array $analysis, int $count): string
    {
        $analysisJson = json_encode($analysis, JSON_PRETTY_PRINT);

        return <<<PROMPT
Based on this fashion design analysis, generate {$count} unique variations of the design.

DESIGN INFORMATION:
- Title: {$design->title}
- Category: {$design->category}
- Season: {$design->season}
- Target Demographic: {$design->target_demographic}

CURRENT ANALYSIS:
{$analysisJson}

Generate {$count} variations that explore different creative directions while maintaining the design's core identity. Each variation should offer a distinct approach:
1. Color palette exploration (different mood/season)
2. Material and texture alternatives
3. Style adaptation for different market segments

Respond with a JSON object in this exact format:
{
  "variations": [
    {
      "description": "Brief description of this variation (2-3 sentences)",
      "color_changes": ["list of color modifications with hex codes"],
      "material_changes": ["list of suggested material swaps"],
      "style_modifications": ["list of style/silhouette changes"],
      "target_market_shift": "How this variation repositions the design in the market",
      "rationale": "Why this variation would appeal to consumers",
      "estimated_appeal_increase": 0-25 (percentage increase in market appeal)
    }
  ]
}
PROMPT;
    }

    /**
     * Extract JSON from a response that may contain markdown code blocks.
     */
    private function extractJsonFromResponse(string $content): string
    {
        // Try to extract JSON from markdown code blocks
        if (preg_match('/```(?:json)?\s*([\s\S]*?)```/', $content, $matches)) {
            return trim($matches[1]);
        }

        // Try to find JSON object directly
        if (preg_match('/\{[\s\S]*\}/', $content, $matches)) {
            return $matches[0];
        }

        return $content;
    }
}
