<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomTemplate extends Model
{
    protected $table = 'room_templates';

    protected $fillable = [
        'config_key', 'name', 'wall_color', 'floor_color',
        'width', 'height', 'grid_cols', 'grid_rows',
        'cell_size', 'default_furniture',
    ];

    protected function casts(): array
    {
        return [
            'default_furniture' => 'array',
        ];
    }
}
