<?php

namespace Database\Factories;

use App\Models\ProductCatalogItem;
use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductCatalogItemFactory extends Factory
{
    protected $model = ProductCatalogItem::class;

    public function definition(): array
    {
        return [
            'supplier_id' => Supplier::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->optional()->paragraph(),
            'category' => fake()->randomElement(['cotton', 'silk', 'wool', 'polyester', 'linen', 'denim']),
            'images' => [
                'products/'.fake()->uuid().'.jpg',
            ],
            'specifications' => [
                'weight' => fake()->numberBetween(100, 500).'gsm',
                'width' => fake()->numberBetween(100, 180).'cm',
            ],
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
