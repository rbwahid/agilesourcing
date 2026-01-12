<?php

namespace Database\Factories;

use App\Models\Design;
use App\Models\DesignVariation;
use App\Models\InstagramConnection;
use App\Models\Validation;
use Illuminate\Database\Eloquent\Factories\Factory;

class ValidationFactory extends Factory
{
    protected $model = Validation::class;

    public function definition(): array
    {
        return [
            'design_id' => Design::factory(),
            'variation_id' => null,
            'instagram_connection_id' => InstagramConnection::factory(),
            'instagram_post_id' => (string) fake()->unique()->numberBetween(1000000000, 9999999999),
            'instagram_post_url' => 'https://instagram.com/p/' . fake()->bothify('???###???'),
            'posted_at' => now(),
            'validation_ends_at' => now()->addHours(48),
            'status' => 'active',
            'likes_count' => 0,
            'comments_count' => 0,
            'shares_count' => 0,
            'saves_count' => 0,
            'engagement_rate' => null,
            'validation_score' => null,
            'is_winner' => false,
        ];
    }

    public function forVariation(): static
    {
        return $this->state(fn (array $attributes) => [
            'variation_id' => DesignVariation::factory(),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'validation_ends_at' => now()->subHours(1),
            'likes_count' => fake()->numberBetween(10, 1000),
            'comments_count' => fake()->numberBetween(1, 100),
            'shares_count' => fake()->numberBetween(0, 50),
            'saves_count' => fake()->numberBetween(0, 200),
            'engagement_rate' => fake()->randomFloat(4, 0.01, 0.15),
            'validation_score' => fake()->numberBetween(30, 100),
        ]);
    }

    public function winner(): static
    {
        return $this->completed()->state(fn (array $attributes) => [
            'is_winner' => true,
        ]);
    }
}
