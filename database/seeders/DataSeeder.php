<?php

namespace Database\Seeders;

use App\Models\AnimationConfig;
use App\Models\CompanionSpecies;
use App\Models\DialogueLine;
use App\Models\FurnitureCatalog;
use App\Models\ItemEffect;
use App\Models\RoomTemplate;
use App\Models\User;
use Illuminate\Database\Seeder;

class DataSeeder extends Seeder
{
    public function run(): void
    {
        User::where('email', 'cosmo@tamagotchi.com')->update(['is_admin' => true]);

        $species = CompanionSpecies::updateOrCreate(['config_key' => 'default'], [
            'name' => 'Milo',
            'display_name' => 'Milo the Fox',
            'default_colors' => ['fur' => '#ff9900', 'eyes' => '#336633', 'belly' => '#ffcc99'],
            'default_personality' => ['energy' => 0.8, 'affection' => 0.9, 'chaos' => 0.3],
            'favorite_foods' => ['berries', 'cake'],
            'description' => 'A friendly fox companion.',
        ]);

        $animData = json_decode(
            file_get_contents(database_path('../resources/js/data/animations/default.json')),
            true
        );

        if ($animData) {
            AnimationConfig::updateOrCreate(
                ['species_id' => $species->id],
                [
                    'spritesheets' => $animData['spritesheets'],
                    'animations' => $animData['animations'],
                ]
            );
        }

        $dialogueData = json_decode(
            file_get_contents(database_path('../resources/js/data/dialogue/default.json')),
            true
        );

        if ($dialogueData && isset($dialogueData['lines'])) {
            foreach ($dialogueData['lines'] as $mood => $lines) {
                DialogueLine::updateOrCreate(
                    ['species_id' => $species->id, 'mood' => $mood],
                    ['lines' => $lines]
                );
            }
        }

        $roomData = json_decode(
            file_get_contents(database_path('../resources/js/data/rooms/default.json')),
            true
        );

        if ($roomData) {
            RoomTemplate::updateOrCreate(['config_key' => 'default'], [
                'name' => $roomData['name'],
                'wall_color' => $roomData['background']['wallColor'],
                'floor_color' => $roomData['background']['floorColor'],
                'width' => $roomData['background']['width'],
                'height' => $roomData['background']['height'],
                'grid_cols' => $roomData['grid']['cols'],
                'grid_rows' => $roomData['grid']['rows'],
                'cell_size' => $roomData['grid']['cellSize'],
                'default_furniture' => $roomData['furnitureSlots'],
            ]);
        }

        $furnitureItems = [
            ['item_id' => 'bed', 'label' => 'Cozy Bed', 'color' => '#8B4513', 'width' => 2, 'height' => 1, 'interactions' => ['sleep'], 'price' => 100],
            ['item_id' => 'bowl', 'label' => 'Food Bowl', 'color' => '#C0C0C0', 'width' => 1, 'height' => 1, 'interactions' => ['feed'], 'price' => 30],
            ['item_id' => 'toy_box', 'label' => 'Toy Box', 'color' => '#FF6347', 'width' => 1, 'height' => 1, 'interactions' => ['play'], 'price' => 75],
            ['item_id' => 'chair', 'label' => 'Comfy Chair', 'color' => '#556B2F', 'width' => 1, 'height' => 1, 'interactions' => ['sit'], 'price' => 50],
            ['item_id' => 'table', 'label' => 'Small Table', 'color' => '#D2B48C', 'width' => 2, 'height' => 2, 'interactions' => [], 'price' => 60],
        ];

        foreach ($furnitureItems as $item) {
            FurnitureCatalog::updateOrCreate(['item_id' => $item['item_id']], $item);
        }

        $itemEffects = [
            ['item_id' => 'berries', 'item_type' => 'food', 'label' => 'Fresh Berries', 'description' => 'A handful of sweet berries.', 'price' => 15, 'effects' => [['stat' => 'hunger', 'value' => 20], ['stat' => 'fun', 'value' => 5]]],
            ['item_id' => 'cake', 'item_type' => 'food', 'label' => 'Celebration Cake', 'description' => 'A delicious slice of cake.', 'price' => 40, 'effects' => [['stat' => 'hunger', 'value' => 40], ['stat' => 'fun', 'value' => 10], ['stat' => 'affection', 'value' => 5]]],
            ['item_id' => 'toy', 'item_type' => 'toy', 'label' => 'Toy Mouse', 'description' => 'A squeaky toy for playtime.', 'price' => 25, 'effects' => [['stat' => 'fun', 'value' => 30], ['stat' => 'energy', 'value' => -5]]],
        ];

        foreach ($itemEffects as $effect) {
            ItemEffect::updateOrCreate(
                ['item_id' => $effect['item_id'], 'item_type' => $effect['item_type']],
                ['label' => $effect['label'], 'description' => $effect['description'], 'price' => $effect['price'], 'effects' => $effect['effects']]
            );
        }
    }
}
