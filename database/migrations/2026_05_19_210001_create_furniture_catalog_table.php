<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('furniture_catalog', function (Blueprint $table) {
            $table->id();
            $table->string('item_id')->unique();
            $table->string('label');
            $table->string('description')->nullable();
            $table->string('color');
            $table->integer('width')->default(1);
            $table->integer('height')->default(1);
            $table->json('interactions')->nullable();
            $table->integer('price')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('furniture_catalog');
    }
};
