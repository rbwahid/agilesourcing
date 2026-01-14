<?php

namespace Database\Factories;

use App\Models\Supplier;
use App\Models\SupplierCertification;
use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierCertificationFactory extends Factory
{
    protected $model = SupplierCertification::class;

    public function definition(): array
    {
        return [
            'supplier_id' => Supplier::factory(),
            'certification_type' => fake()->randomElement([
                'GOTS', 'OEKO_TEX', 'FAIR_TRADE', 'ISO_9001', 'ISO_14001', 'BSCI', 'WRAP', 'SA8000', 'OTHER',
            ]),
            'certificate_path' => 'certifications/'.fake()->uuid().'.pdf',
            'expiry_date' => fake()->optional()->dateTimeBetween('now', '+2 years'),
            'verified_at' => null,
            'verified_by' => null,
        ];
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'verified_at' => now(),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'expiry_date' => now()->subDays(30),
        ]);
    }
}
