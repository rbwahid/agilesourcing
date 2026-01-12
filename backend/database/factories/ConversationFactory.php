<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ConversationFactory extends Factory
{
    protected $model = Conversation::class;

    public function definition(): array
    {
        return [
            'designer_id' => User::factory(),
            'supplier_id' => User::factory(),
            'subject' => fake()->optional()->sentence(4),
            'status' => 'active',
            'last_message_at' => fake()->optional()->dateTimeBetween('-30 days', 'now'),
        ];
    }

    public function archived(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'archived',
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed',
        ]);
    }
}
