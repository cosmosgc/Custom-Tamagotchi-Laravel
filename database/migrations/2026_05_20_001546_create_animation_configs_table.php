<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('animation_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('species_id')->constrained('companion_species')->cascadeOnDelete();
            $table->json('spritesheets');
            $table->json('animations');
            $table->timestamps();

            $table->unique('species_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('animation_configs');
    }
};
