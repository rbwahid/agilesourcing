<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('validations', function (Blueprint $table) {
            // Add mockup reference
            $table->foreignId('mockup_id')->nullable()->after('instagram_connection_id')
                ->constrained()->nullOnDelete();

            // Add caption for Instagram post
            $table->text('caption')->nullable()->after('instagram_post_url');

            // Add user-configurable validation duration
            $table->unsignedInteger('validation_duration_hours')->default(48)->after('caption');

            // Add hourly metrics for tracking engagement over time
            $table->json('hourly_metrics')->nullable()->after('validation_score');
        });

        // Make instagram_post_id and instagram_post_url nullable (set after posting)
        Schema::table('validations', function (Blueprint $table) {
            $table->string('instagram_post_id')->nullable()->change();
            $table->string('instagram_post_url')->nullable()->change();
            $table->timestamp('posted_at')->nullable()->change();
            $table->timestamp('validation_ends_at')->nullable()->change();
        });

        // Update status enum to include 'pending'
        DB::statement("ALTER TABLE validations MODIFY COLUMN status ENUM('pending', 'active', 'completed', 'failed', 'cancelled') DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert status enum
        DB::statement("ALTER TABLE validations MODIFY COLUMN status ENUM('active', 'completed', 'failed', 'cancelled') DEFAULT 'active'");

        Schema::table('validations', function (Blueprint $table) {
            $table->dropForeign(['mockup_id']);
            $table->dropColumn(['mockup_id', 'caption', 'validation_duration_hours', 'hourly_metrics']);
        });
    }
};
