<?php

namespace Database\Factories;

use App\Models\Conversation;
use App\Models\Design;
use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'design_id' => fake()->optional()->randomElement([Design::factory(), null]),
            'status' => 'new',
        ];
    }

    public function inProgress(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'in_progress',
        ]);
    }

    public function quoted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'quoted',
        ]);
    }

    public function closed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'closed',
        ]);
    }
}
