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
        Schema::create('mockups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_id')->constrained()->cascadeOnDelete();
            $table->foreignId('design_variation_id')->nullable()->constrained()->nullOnDelete();
            $table->string('model_type'); // 'male', 'female', 'unisex'
            $table->string('pose'); // 'front', 'side', 'back', 'action'
            $table->string('background'); // 'studio', 'outdoor', 'urban', 'beach'
            $table->string('file_path')->nullable();
            $table->string('file_url')->nullable();
            $table->text('generation_prompt')->nullable();
            $table->string('error_message')->nullable();
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->timestamps();

            $table->index(['design_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mockups');
    }
};
