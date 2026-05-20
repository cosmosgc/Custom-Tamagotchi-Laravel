<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FurnitureCatalog extends Model
{
    protected $table = 'furniture_catalog';

    protected $fillable = [
        'item_id', 'label', 'description', 'color',
        'width', 'height', 'interactions', 'price',
    ];

    protected function casts(): array
    {
        return [
            'interactions' => 'array',
            'width' => 'integer',
            'height' => 'integer',
            'price' => 'integer',
        ];
    }
}
