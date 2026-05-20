<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnimationConfig extends Model
{
    protected $fillable = [
        'species_id', 'spritesheets', 'animations',
    ];

    protected function casts(): array
    {
        return [
            'spritesheets' => 'array',
            'animations' => 'array',
        ];
    }
}
