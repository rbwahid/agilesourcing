<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    protected $model = Supplier::class;

    public function definition(): array
    {
        return [
            'profile_id' => Profile::factory()->supplier(),
            'service_type' => fake()->randomElement(['fabric', 'cmt', 'full_production']),
            'minimum_order_quantity' => fake()->numberBetween(50, 500),
            'lead_time_days' => fake()->numberBetween(14, 60),
            'production_capacity' => fake()->optional()->numberBetween(1000, 50000),
            'certifications' => fake()->optional()->randomElements(['GOTS', 'OEKO_TEX', 'FAIR_TRADE', 'ISO_9001'], rand(0, 3)),
            'is_verified' => false,
            'is_featured' => false,
            'response_time_hours' => fake()->optional()->numberBetween(1, 48),
        ];
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_verified' => true,
            'is_featured' => true,
        ]);
    }

    public function fabric(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type' => 'fabric',
        ]);
    }

    public function cmt(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type' => 'cmt',
        ]);
    }

    public function fullProduction(): static
    {
        return $this->state(fn (array $attributes) => [
            'service_type' => 'full_production',
        ]);
    }
}
