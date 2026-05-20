<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_templates', function (Blueprint $table) {
            $table->id();
            $table->string('config_key')->unique();
            $table->string('name');
            $table->string('wall_color')->default('#f5e6ca');
            $table->string('floor_color')->default('#c4a882');
            $table->integer('width')->default(800);
            $table->integer('height')->default(600);
            $table->integer('grid_cols')->default(10);
            $table->integer('grid_rows')->default(8);
            $table->integer('cell_size')->default(64);
            $table->json('default_furniture')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_templates');
    }
};
