<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PlanFactory extends Factory
{
    protected $model = Plan::class;

    public function definition(): array
    {
        $name = fake()->unique()->randomElement(['Basic', 'Premium', 'Enterprise', 'Starter']);

        return [
            'name' => $name,
            'slug' => Str::slug($name.'-'.fake()->randomElement(['designer', 'supplier'])),
            'user_type' => fake()->randomElement(['designer', 'supplier']),
            'price_monthly' => fake()->randomFloat(2, 10, 200),
            'price_annual' => fake()->randomFloat(2, 100, 2000),
            'features' => [
                'feature_1' => true,
                'feature_2' => true,
                'feature_3' => fake()->boolean(),
            ],
            'design_uploads_limit' => fake()->optional()->numberBetween(5, 100),
            'validations_limit' => fake()->optional()->numberBetween(1, 50),
            'is_active' => true,
        ];
    }

    public function forDesigner(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_type' => 'designer',
        ]);
    }

    public function forSupplier(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_type' => 'supplier',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
