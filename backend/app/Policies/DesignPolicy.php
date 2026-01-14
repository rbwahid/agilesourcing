<?php

namespace App\Policies;

use App\Models\Design;
use App\Models\User;

class DesignPolicy
{
    /**
     * Determine whether the user can view any designs.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the design.
     */
    public function view(User $user, Design $design): bool
    {
        // Owner can view their own designs
        if ($design->user_id === $user->id) {
            return true;
        }

        // Admins can view all designs
        if ($user->hasRole(['admin', 'super_admin'])) {
            return true;
        }

        // Suppliers can view designs shared with them in conversations
        if ($user->hasRole('supplier') && $user->supplier) {
            return $design->user->conversations()
                ->where('supplier_id', $user->supplier->id)
                ->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create designs.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('designer');
    }

    /**
     * Determine whether the user can update the design.
     */
    public function update(User $user, Design $design): bool
    {
        return $design->user_id === $user->id;
    }

    /**
     * Determine whether the user can delete the design.
     */
    public function delete(User $user, Design $design): bool
    {
        // Only owner can delete
        if ($design->user_id === $user->id) {
            return true;
        }

        // Super admins can delete any design
        return $user->hasRole('super_admin');
    }

    /**
     * Determine whether the user can trigger AI analysis.
     */
    public function analyze(User $user, Design $design): bool
    {
        return $design->user_id === $user->id;
    }

    /**
     * Determine whether the user can generate variations.
     */
    public function generateVariations(User $user, Design $design): bool
    {
        return $design->user_id === $user->id;
    }
}
