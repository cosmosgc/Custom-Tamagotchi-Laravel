<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item_effects', function (Blueprint $table) {
            $table->id();
            $table->string('item_id');
            $table->string('item_type')->default('consumable');
            $table->json('effects');
            $table->timestamps();

            $table->unique(['item_id', 'item_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('item_effects');
    }
};
