<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('companions')->where('coins', 0)->update(['coins' => 100]);
    }

    public function down(): void
    {
        DB::table('companions')->update(['coins' => 0]);
    }
};
