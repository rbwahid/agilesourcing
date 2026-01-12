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
        Schema::create('validations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('design_id')->constrained()->cascadeOnDelete();
            $table->foreignId('variation_id')->nullable()->constrained('design_variations')->nullOnDelete();
            $table->foreignId('instagram_connection_id')->constrained()->cascadeOnDelete();
            $table->string('instagram_post_id');
            $table->string('instagram_post_url');
            $table->timestamp('posted_at');
            $table->timestamp('validation_ends_at');
            $table->enum('status', ['active', 'completed', 'failed', 'cancelled'])->default('active');
            $table->unsignedInteger('likes_count')->default(0);
            $table->unsignedInteger('comments_count')->default(0);
            $table->unsignedInteger('shares_count')->default(0);
            $table->unsignedInteger('saves_count')->default(0);
            $table->decimal('engagement_rate', 8, 4)->nullable();
            $table->unsignedTinyInteger('validation_score')->nullable();
            $table->boolean('is_winner')->default(false);
            $table->timestamps();

            $table->index(['design_id', 'status']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('validations');
    }
};
