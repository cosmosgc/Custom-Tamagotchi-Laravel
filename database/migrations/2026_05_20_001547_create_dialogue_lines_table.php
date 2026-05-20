<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dialogue_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('species_id')->constrained('companion_species')->cascadeOnDelete();
            $table->string('mood');
            $table->json('lines');
            $table->timestamps();

            $table->unique(['species_id', 'mood']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dialogue_lines');
    }
};
