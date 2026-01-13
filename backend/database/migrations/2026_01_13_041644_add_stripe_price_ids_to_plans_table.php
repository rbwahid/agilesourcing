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
        Schema::table('plans', function (Blueprint $table) {
            // Stripe price IDs for monthly and annual billing
            $table->string('stripe_price_monthly_id')->nullable()->after('price_annual');
            $table->string('stripe_price_annual_id')->nullable()->after('stripe_price_monthly_id');

            // Stripe product ID (one product per plan)
            $table->string('stripe_product_id')->nullable()->after('stripe_price_annual_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn([
                'stripe_price_monthly_id',
                'stripe_price_annual_id',
                'stripe_product_id',
            ]);
        });
    }
};
