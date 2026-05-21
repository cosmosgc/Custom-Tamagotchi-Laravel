<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('item_effects', function (Blueprint $table) {
            $table->string('label')->after('item_type');
            $table->text('description')->nullable()->after('label');
            $table->integer('price')->default(0)->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('item_effects', function (Blueprint $table) {
            $table->dropColumn(['label', 'description', 'price']);
        });
    }
};
