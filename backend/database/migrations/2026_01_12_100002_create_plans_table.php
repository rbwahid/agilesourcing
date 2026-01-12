<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->enum('user_type', ['designer', 'supplier']);
            $table->decimal('price_monthly', 10, 2);
            $table->decimal('price_annual', 10, 2);
            $table->json('features');
            $table->unsignedInteger('design_uploads_limit')->nullable();
            $table->unsignedInteger('validations_limit')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['user_type', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
