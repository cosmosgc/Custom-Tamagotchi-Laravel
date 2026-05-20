<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companion_species', function (Blueprint $table) {
            $table->id();
            $table->string('config_key')->unique();
            $table->string('name');
            $table->string('display_name');
            $table->json('default_colors')->nullable();
            $table->json('default_personality')->nullable();
            $table->json('favorite_foods')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companion_species');
    }
};
