<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles and permissions first
        $this->call([
            RolesAndPermissionsSeeder::class,
            PlansSeeder::class,
        ]);

        // Create a test admin user
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@agilesourcing.com',
            'role' => 'super_admin',
        ]);
        $admin->assignRole('super_admin');

        // Create a test designer user
        $designer = User::factory()->create([
            'name' => 'Test Designer',
            'email' => 'designer@example.com',
            'role' => 'designer',
        ]);
        $designer->assignRole('designer');

        // Create a test supplier user
        $supplier = User::factory()->create([
            'name' => 'Test Supplier',
            'email' => 'supplier@example.com',
            'role' => 'supplier',
        ]);
        $supplier->assignRole('supplier');
    }
}
