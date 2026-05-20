<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Companion extends Model
{
    protected $fillable = [
        'user_id', 'name', 'species', 'companion_config',
        'hunger', 'energy', 'fun', 'affection', 'mood',
        'sleeping', 'coins', 'last_online',
    ];

    protected function casts(): array
    {
        return [
            'sleeping' => 'boolean',
            'last_online' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
