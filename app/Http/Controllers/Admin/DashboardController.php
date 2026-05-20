<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanionSpecies;
use App\Models\FurnitureCatalog;
use App\Models\AnimationConfig;
use App\Models\DialogueLine;
use App\Models\RoomTemplate;

class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'speciesCount' => CompanionSpecies::count(),
            'furnitureCount' => FurnitureCatalog::count(),
            'animationCount' => AnimationConfig::count(),
            'dialogueCount' => DialogueLine::count(),
            'roomCount' => RoomTemplate::count(),
        ]);
    }
}
