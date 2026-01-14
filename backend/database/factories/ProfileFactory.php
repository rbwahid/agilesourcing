<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['designer', 'supplier']),
            'business_name' => fake()->company(),
            'location' => fake()->city().', '.fake()->country(),
            'bio' => fake()->paragraph(),
            'profile_image_path' => null,
            'website_url' => fake()->optional()->url(),
            'phone' => fake()->optional()->phoneNumber(),
            'verification_status' => 'unverified',
            'verification_submitted_at' => null,
            'onboarding_completed_at' => null,
        ];
    }

    public function designer(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'designer',
        ]);
    }

    public function supplier(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'supplier',
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn (array $attributes) => [
            'verification_status' => 'verified',
            'verification_submitted_at' => now()->subDays(7),
        ]);
    }

    public function onboarded(): static
    {
        return $this->state(fn (array $attributes) => [
            'onboarding_completed_at' => now(),
        ]);
    }
}
