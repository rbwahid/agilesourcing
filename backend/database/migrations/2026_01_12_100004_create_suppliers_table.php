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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('profile_id')->unique()->constrained()->cascadeOnDelete();
            $table->enum('service_type', ['fabric', 'cmt', 'full_production']);
            $table->unsignedInteger('minimum_order_quantity');
            $table->unsignedInteger('lead_time_days');
            $table->unsignedInteger('production_capacity')->nullable();
            $table->json('certifications')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('response_time_hours')->nullable();
            $table->timestamps();

            $table->index(['service_type', 'is_verified']);
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
