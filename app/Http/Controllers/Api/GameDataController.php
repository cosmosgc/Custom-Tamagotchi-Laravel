<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnimationConfig;
use App\Models\CompanionSpecies;
use App\Models\DialogueLine;
use App\Models\FurnitureCatalog;
use App\Models\RoomTemplate;
use Illuminate\Http\JsonResponse;

class GameDataController extends Controller
{
    public function species(string $configKey = 'default'): JsonResponse
    {
        $species = CompanionSpecies::where('config_key', $configKey)->first();
        if (!$species) {
            return response()->json(['data' => null, 'message' => 'Species not found'], 404);
        }
        return response()->json(['data' => $species]);
    }

    public function animations(string $configKey = 'default'): JsonResponse
    {
        $species = CompanionSpecies::where('config_key', $configKey)->first();
        if (!$species) {
            return response()->json(['data' => null, 'message' => 'Species not found'], 404);
        }
        $config = AnimationConfig::where('species_id', $species->id)->first();
        if (!$config) {
            return response()->json(['data' => null, 'message' => 'Animation config not found'], 404);
        }
        return response()->json(['data' => [
            'spritesheets' => $config->spritesheets,
            'animations' => $config->animations,
        ]]);
    }

    public function dialogue(string $configKey = 'default'): JsonResponse
    {
        $species = CompanionSpecies::where('config_key', $configKey)->first();
        if (!$species) {
            return response()->json(['data' => null, 'message' => 'Species not found'], 404);
        }
        $lines = DialogueLine::where('species_id', $species->id)->get();
        $result = [];
        foreach ($lines as $line) {
            $result[$line->mood] = $line->lines;
        }
        return response()->json(['data' => ['lines' => $result]]);
    }

    public function roomTemplate(string $configKey = 'default'): JsonResponse
    {
        $room = RoomTemplate::where('config_key', $configKey)->first();
        if (!$room) {
            return response()->json(['data' => null, 'message' => 'Room template not found'], 404);
        }
        return response()->json(['data' => [
            'name' => $room->name,
            'background' => [
                'wallColor' => $room->wall_color,
                'floorColor' => $room->floor_color,
                'width' => $room->width,
                'height' => $room->height,
            ],
            'grid' => [
                'cols' => $room->grid_cols,
                'rows' => $room->grid_rows,
                'cellSize' => $room->cell_size,
            ],
            'furnitureSlots' => $room->default_furniture ?? [],
        ]]);
    }

    public function catalog(): JsonResponse
    {
        $catalog = FurnitureCatalog::all();
        return response()->json(['data' => ['furniture' => $catalog]]);
    }
}
