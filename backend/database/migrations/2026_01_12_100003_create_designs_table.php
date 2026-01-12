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
        Schema::create('designs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('category');
            $table->string('season')->nullable();
            $table->string('target_demographic')->nullable();
            $table->string('file_path');
            $table->string('file_type');
            $table->string('original_filename');
            $table->unsignedInteger('file_size');
            $table->enum('ai_analysis_status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->json('ai_analysis_result')->nullable();
            $table->unsignedTinyInteger('trend_score')->nullable();
            $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['category', 'status']);
            $table->index('ai_analysis_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('designs');
    }
};
