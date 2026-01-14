<?php

namespace Database\Factories;

use App\Models\Design;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DesignFactory extends Factory
{
    protected $model = Design::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(3),
            'description' => fake()->optional()->paragraph(),
            'category' => fake()->randomElement(['dresses', 'tops', 'bottoms', 'outerwear', 'accessories']),
            'season' => fake()->optional()->randomElement(['spring', 'summer', 'fall', 'winter']),
            'target_demographic' => fake()->optional()->randomElement(['women', 'men', 'unisex', 'children']),
            'file_path' => 'designs/'.fake()->uuid().'.jpg',
            'file_type' => fake()->randomElement(['jpg', 'png', 'pdf']),
            'original_filename' => fake()->word().'.jpg',
            'file_size' => fake()->numberBetween(100000, 5000000),
            'ai_analysis_status' => 'pending',
            'ai_analysis_result' => null,
            'trend_score' => null,
            'status' => 'draft',
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    public function analyzed(): static
    {
        return $this->state(fn (array $attributes) => [
            'ai_analysis_status' => 'completed',
            'ai_analysis_result' => [
                'style_elements' => ['modern', 'minimalist'],
                'colors' => ['blue', 'white'],
                'patterns' => ['solid'],
            ],
            'trend_score' => fake()->numberBetween(50, 100),
        ]);
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }
}
