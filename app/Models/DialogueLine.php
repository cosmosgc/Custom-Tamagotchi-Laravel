<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DialogueLine extends Model
{
    protected $table = 'dialogue_lines';

    protected $fillable = [
        'species_id', 'mood', 'lines',
    ];

    protected function casts(): array
    {
        return [
            'lines' => 'array',
        ];
    }
}
