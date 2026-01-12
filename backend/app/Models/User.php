<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Cashier\Billable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles, Billable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the user's profile.
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    /**
     * Get the user's designs.
     */
    public function designs(): HasMany
    {
        return $this->hasMany(Design::class);
    }

    /**
     * Get the user's Instagram connections (legacy - supports multiple).
     */
    public function instagramConnections(): HasMany
    {
        return $this->hasMany(InstagramConnection::class);
    }

    /**
     * Get the user's primary Instagram connection.
     */
    public function instagramConnection(): HasOne
    {
        return $this->hasOne(InstagramConnection::class)->latestOfMany();
    }

    /**
     * Get conversations where user is the designer.
     */
    public function designerConversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'designer_id');
    }

    /**
     * Get conversations where user is the supplier.
     */
    public function supplierConversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'supplier_id');
    }

    /**
     * Get all messages sent by the user.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get suppliers saved by this user (designer).
     */
    public function savedSuppliers()
    {
        return $this->belongsToMany(Supplier::class, 'saved_suppliers')
            ->withTimestamps();
    }

    /**
     * Check if user is a designer.
     */
    public function isDesigner(): bool
    {
        return $this->role === 'designer';
    }

    /**
     * Check if user is a supplier.
     */
    public function isSupplier(): bool
    {
        return $this->role === 'supplier';
    }

    /**
     * Check if user is an admin.
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    /**
     * Check if user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }
}
