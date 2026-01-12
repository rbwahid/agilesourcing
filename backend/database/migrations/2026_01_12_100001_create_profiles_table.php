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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->enum('type', ['designer', 'supplier']);
            $table->string('business_name');
            $table->string('location')->nullable();
            $table->text('bio')->nullable();
            $table->string('profile_image_path')->nullable();
            $table->string('website_url')->nullable();
            $table->string('phone')->nullable();
            $table->enum('verification_status', ['unverified', 'pending', 'verified', 'rejected'])->default('unverified');
            $table->timestamp('verification_submitted_at')->nullable();
            $table->timestamp('onboarding_completed_at')->nullable();
            $table->timestamps();

            $table->index(['type', 'verification_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
