<?php

namespace Database\Factories;

use App\Models\InstagramConnection;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class InstagramConnectionFactory extends Factory
{
    protected $model = InstagramConnection::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'instagram_user_id' => (string) fake()->unique()->numberBetween(1000000, 9999999999),
            'instagram_username' => fake()->unique()->userName(),
            'access_token' => fake()->sha256(),
            'token_expires_at' => now()->addDays(60),
            'profile_picture_url' => fake()->optional()->imageUrl(),
            'followers_count' => fake()->optional()->numberBetween(100, 1000000),
            'connected_at' => now(),
        ];
    }

    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'token_expires_at' => now()->subDays(1),
        ]);
    }

    public function expiringSoon(): static
    {
        return $this->state(fn (array $attributes) => [
            'token_expires_at' => now()->addDays(3),
        ]);
    }
}
