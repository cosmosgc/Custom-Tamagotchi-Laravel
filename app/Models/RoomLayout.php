<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoomLayout extends Model
{
    protected $fillable = [
        'user_id', 'room_id', 'furniture',
    ];

    protected function casts(): array
    {
        return [
            'furniture' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
