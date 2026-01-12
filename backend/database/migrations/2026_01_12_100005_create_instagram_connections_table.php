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
        Schema::create('instagram_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('instagram_user_id');
            $table->string('instagram_username');
            $table->text('access_token');
            $table->timestamp('token_expires_at');
            $table->string('profile_picture_url')->nullable();
            $table->unsignedInteger('followers_count')->nullable();
            $table->timestamp('connected_at');
            $table->timestamps();

            $table->index('user_id');
            $table->unique(['user_id', 'instagram_user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instagram_connections');
    }
};
