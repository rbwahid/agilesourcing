<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InstagramConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'instagram_user_id',
        'instagram_username',
        'access_token',
        'token_expires_at',
        'profile_picture_url',
        'followers_count',
        'connected_at',
    ];

    protected $hidden = [
        'access_token',
    ];

    protected function casts(): array
    {
        return [
            'token_expires_at' => 'datetime',
            'connected_at' => 'datetime',
            'followers_count' => 'integer',
            'access_token' => 'encrypted',
        ];
    }

    /**
     * Get the user that owns the connection.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get validations using this connection.
     */
    public function validations(): HasMany
    {
        return $this->hasMany(Validation::class);
    }

    /**
     * Check if the token is expired.
     */
    public function isTokenExpired(): bool
    {
        return $this->token_expires_at->isPast();
    }

    /**
     * Check if the token expires soon (within 7 days).
     */
    public function isTokenExpiringSoon(): bool
    {
        return $this->token_expires_at->isBefore(now()->addDays(7));
    }
}
