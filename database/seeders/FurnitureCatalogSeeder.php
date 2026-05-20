<?php

namespace Database\Seeders;

use App\Models\FurnitureCatalog;
use Illuminate\Database\Seeder;

class FurnitureCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['item_id' => 'bed',       'label' => 'Cozy Bed',     'color' => '#8B4513', 'width' => 2, 'height' => 1, 'interactions' => ['sleep'],       'price' => 100],
            ['item_id' => 'bowl',      'label' => 'Food Bowl',    'color' => '#C0C0C0', 'width' => 1, 'height' => 1, 'interactions' => ['feed'],       'price' => 30],
            ['item_id' => 'toy_box',   'label' => 'Toy Box',      'color' => '#FF6347', 'width' => 1, 'height' => 1, 'interactions' => ['play'],       'price' => 75],
            ['item_id' => 'chair',     'label' => 'Comfy Chair',  'color' => '#556B2F', 'width' => 1, 'height' => 1, 'interactions' => ['sit'],        'price' => 50],
            ['item_id' => 'table',     'label' => 'Small Table',  'color' => '#D2B48C', 'width' => 2, 'height' => 2, 'interactions' => [],             'price' => 60],
        ];

        foreach ($items as $item) {
            FurnitureCatalog::updateOrCreate(
                ['item_id' => $item['item_id']],
                $item
            );
        }
    }
}
