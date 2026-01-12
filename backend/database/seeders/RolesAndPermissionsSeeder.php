<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Design permissions
            'designs.view',
            'designs.create',
            'designs.edit',
            'designs.delete',
            'designs.analyze',
            'designs.validate',

            // Supplier permissions
            'suppliers.view',
            'suppliers.contact',
            'suppliers.save',

            // Messaging permissions
            'messages.view',
            'messages.send',

            // Profile permissions
            'profile.view',
            'profile.edit',

            // Subscription permissions
            'subscription.view',
            'subscription.manage',

            // Admin permissions
            'admin.access',
            'admin.users.view',
            'admin.users.edit',
            'admin.users.delete',
            'admin.suppliers.verify',
            'admin.subscriptions.manage',
            'admin.analytics.view',
            'admin.settings.manage',
            'admin.audit.view',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $designerRole = Role::create(['name' => 'designer']);
        $designerRole->givePermissionTo([
            'designs.view',
            'designs.create',
            'designs.edit',
            'designs.delete',
            'designs.analyze',
            'designs.validate',
            'suppliers.view',
            'suppliers.contact',
            'suppliers.save',
            'messages.view',
            'messages.send',
            'profile.view',
            'profile.edit',
            'subscription.view',
            'subscription.manage',
        ]);

        $supplierRole = Role::create(['name' => 'supplier']);
        $supplierRole->givePermissionTo([
            'suppliers.view',
            'messages.view',
            'messages.send',
            'profile.view',
            'profile.edit',
            'subscription.view',
            'subscription.manage',
        ]);

        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'admin.access',
            'admin.users.view',
            'admin.users.edit',
            'admin.suppliers.verify',
            'admin.subscriptions.manage',
            'admin.analytics.view',
            'admin.audit.view',
        ]);

        $superAdminRole = Role::create(['name' => 'super_admin']);
        $superAdminRole->givePermissionTo(Permission::all());
    }
}
