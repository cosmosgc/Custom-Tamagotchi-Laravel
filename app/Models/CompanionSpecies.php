<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CompanionSpecies extends Model
{
    protected $table = 'companion_species';

    protected $fillable = [
        'config_key', 'name', 'display_name',
        'default_colors', 'default_personality',
        'favorite_foods', 'description',
    ];

    protected function casts(): array
    {
        return [
            'default_colors' => 'array',
            'default_personality' => 'array',
            'favorite_foods' => 'array',
        ];
    }

    public function animationConfig(): HasMany
    {
        return $this->hasMany(AnimationConfig::class, 'species_id');
    }

    public function dialogueLines(): HasMany
    {
        return $this->hasMany(DialogueLine::class, 'species_id');
    }
}
