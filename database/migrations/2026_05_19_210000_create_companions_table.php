<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name')->default('Milo');
            $table->string('species')->default('Fox');
            $table->string('companion_config')->default('default');
            $table->float('hunger')->default(80);
            $table->float('energy')->default(80);
            $table->float('fun')->default(50);
            $table->float('affection')->default(30);
            $table->string('mood')->default('neutral');
            $table->boolean('sleeping')->default(false);
            $table->integer('coins')->default(0);
            $table->timestamp('last_online')->useCurrent();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companions');
    }
};
