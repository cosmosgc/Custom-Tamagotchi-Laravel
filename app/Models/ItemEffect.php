<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ItemEffect extends Model
{
    protected $table = 'item_effects';

    protected $fillable = [
        'item_id',
        'item_type',
        'label',
        'description',
        'price',
        'effects',
    ];

    protected function casts(): array
    {
        return [
            'effects' => 'array',
        ];
    }
}
