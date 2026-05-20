<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_layouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('room_id')->default('default');
            $table->json('furniture')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'room_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_layouts');
    }
};
