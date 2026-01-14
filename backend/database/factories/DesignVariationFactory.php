<?php

namespace Database\Factories;

use App\Models\Design;
use App\Models\DesignVariation;
use Illuminate\Database\Eloquent\Factories\Factory;

class DesignVariationFactory extends Factory
{
    protected $model = DesignVariation::class;

    public function definition(): array
    {
        return [
            'design_id' => Design::factory(),
            'variation_number' => fake()->numberBetween(1, 3),
            'description' => fake()->sentence(),
            'file_path' => 'variations/'.fake()->uuid().'.jpg',
            'ai_suggestions' => [
                'color_changes' => fake()->words(2),
                'pattern_changes' => fake()->optional()->word(),
                'silhouette_notes' => fake()->optional()->sentence(),
            ],
        ];
    }
}
