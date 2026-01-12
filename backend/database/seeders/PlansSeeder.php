<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlansSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Designer Plans
        Plan::create([
            'name' => 'Designer Basic',
            'slug' => 'designer-basic',
            'user_type' => 'designer',
            'price_monthly' => 40.00,
            'price_annual' => 400.00,
            'features' => [
                'design_uploads' => true,
                'ai_analysis' => true,
                'trend_scoring' => true,
                'design_variations' => true,
                'instagram_validation' => true,
                'supplier_directory' => true,
                'supplier_contact' => true,
                'messaging' => true,
                'export_reports' => false,
                'priority_support' => false,
            ],
            'design_uploads_limit' => 10,
            'validations_limit' => 5,
            'is_active' => true,
        ]);

        Plan::create([
            'name' => 'Designer Premium',
            'slug' => 'designer-premium',
            'user_type' => 'designer',
            'price_monthly' => 100.00,
            'price_annual' => 1000.00,
            'features' => [
                'design_uploads' => true,
                'ai_analysis' => true,
                'trend_scoring' => true,
                'design_variations' => true,
                'instagram_validation' => true,
                'supplier_directory' => true,
                'supplier_contact' => true,
                'messaging' => true,
                'export_reports' => true,
                'priority_support' => true,
                'advanced_analytics' => true,
            ],
            'design_uploads_limit' => null, // unlimited
            'validations_limit' => null, // unlimited
            'is_active' => true,
        ]);

        // Supplier Plans
        Plan::create([
            'name' => 'Supplier Basic',
            'slug' => 'supplier-basic',
            'user_type' => 'supplier',
            'price_monthly' => 150.00,
            'price_annual' => 1500.00,
            'features' => [
                'profile_listing' => true,
                'product_catalog' => true,
                'inquiry_management' => true,
                'messaging' => true,
                'verification_badge' => true,
                'featured_listing' => false,
                'analytics_dashboard' => false,
                'priority_support' => false,
            ],
            'design_uploads_limit' => null,
            'validations_limit' => null,
            'is_active' => true,
        ]);

        Plan::create([
            'name' => 'Supplier Premium',
            'slug' => 'supplier-premium',
            'user_type' => 'supplier',
            'price_monthly' => 225.00,
            'price_annual' => 2250.00,
            'features' => [
                'profile_listing' => true,
                'product_catalog' => true,
                'inquiry_management' => true,
                'messaging' => true,
                'verification_badge' => true,
                'featured_listing' => true,
                'analytics_dashboard' => true,
                'priority_support' => true,
                'lead_insights' => true,
            ],
            'design_uploads_limit' => null,
            'validations_limit' => null,
            'is_active' => true,
        ]);
    }
}
