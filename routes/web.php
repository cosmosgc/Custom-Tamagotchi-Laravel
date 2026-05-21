<?php

use App\Http\Controllers\Admin\AnimationConfigController;
use App\Http\Controllers\Admin\CompanionSpeciesController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DialogueLineController;
use App\Http\Controllers\Admin\FurnitureCatalogController;
use App\Http\Controllers\Admin\RoomTemplateController;
use App\Http\Controllers\Api\CompanionController;
use App\Http\Controllers\Api\GameDataController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // API routes (auth-protected, under web middleware for session support)
    Route::prefix('api')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::get('/companion', [CompanionController::class, 'show']);
        Route::put('/companion', [CompanionController::class, 'update']);

        Route::get('/room', [RoomController::class, 'show']);
        Route::put('/room', [RoomController::class, 'update']);

        Route::get('/inventory', [InventoryController::class, 'index']);
        Route::post('/inventory/add', [InventoryController::class, 'addItem']);
        Route::delete('/inventory/remove/{itemId}', [InventoryController::class, 'removeItem']);

        Route::get('/catalog', [InventoryController::class, 'catalog']);

        Route::get('/users', [UserController::class, 'index']);
        Route::get('/profile', [UserController::class, 'profile']);

        Route::get('/companion/user/{userId}', [CompanionController::class, 'showUser']);

        Route::get('/shop/catalog', [ShopController::class, 'catalog']);
        Route::post('/shop/buy', [ShopController::class, 'buy']);

        // Game data endpoints (from database instead of JSON files)
        Route::get('/game-data/species/{configKey?}', [GameDataController::class, 'species']);
        Route::get('/game-data/animations/{configKey?}', [GameDataController::class, 'animations']);
        Route::get('/game-data/dialogue/{configKey?}', [GameDataController::class, 'dialogue']);
        Route::get('/game-data/room-template/{configKey?}', [GameDataController::class, 'roomTemplate']);
        Route::get('/game-data/item-effects', [GameDataController::class, 'itemEffects']);
    });

    // Admin routes
    Route::prefix('admin')->middleware('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::get('/species', [CompanionSpeciesController::class, 'index'])->name('species.index');
        Route::get('/species/create', [CompanionSpeciesController::class, 'create'])->name('species.create');
        Route::post('/species', [CompanionSpeciesController::class, 'store'])->name('species.store');
        Route::get('/species/{species}/edit', [CompanionSpeciesController::class, 'edit'])->name('species.edit');
        Route::put('/species/{species}', [CompanionSpeciesController::class, 'update'])->name('species.update');
        Route::delete('/species/{species}', [CompanionSpeciesController::class, 'destroy'])->name('species.destroy');

        Route::get('/animations', [AnimationConfigController::class, 'index'])->name('animations.index');
        Route::get('/animations/create', [AnimationConfigController::class, 'create'])->name('animations.create');
        Route::post('/animations', [AnimationConfigController::class, 'store'])->name('animations.store');
        Route::get('/animations/{animation}/edit', [AnimationConfigController::class, 'edit'])->name('animations.edit');
        Route::put('/animations/{animation}', [AnimationConfigController::class, 'update'])->name('animations.update');
        Route::delete('/animations/{animation}', [AnimationConfigController::class, 'destroy'])->name('animations.destroy');

        Route::get('/dialogue', [DialogueLineController::class, 'index'])->name('dialogue.index');
        Route::get('/dialogue/create', [DialogueLineController::class, 'create'])->name('dialogue.create');
        Route::post('/dialogue', [DialogueLineController::class, 'store'])->name('dialogue.store');
        Route::get('/dialogue/{dialogue}/edit', [DialogueLineController::class, 'edit'])->name('dialogue.edit');
        Route::put('/dialogue/{dialogue}', [DialogueLineController::class, 'update'])->name('dialogue.update');
        Route::delete('/dialogue/{dialogue}', [DialogueLineController::class, 'destroy'])->name('dialogue.destroy');

        Route::get('/rooms', [RoomTemplateController::class, 'index'])->name('rooms.index');
        Route::get('/rooms/create', [RoomTemplateController::class, 'create'])->name('rooms.create');
        Route::post('/rooms', [RoomTemplateController::class, 'store'])->name('rooms.store');
        Route::get('/rooms/{room}/edit', [RoomTemplateController::class, 'edit'])->name('rooms.edit');
        Route::put('/rooms/{room}', [RoomTemplateController::class, 'update'])->name('rooms.update');
        Route::delete('/rooms/{room}', [RoomTemplateController::class, 'destroy'])->name('rooms.destroy');

        Route::get('/furniture', [FurnitureCatalogController::class, 'index'])->name('furniture.index');
        Route::get('/furniture/create', [FurnitureCatalogController::class, 'create'])->name('furniture.create');
        Route::post('/furniture', [FurnitureCatalogController::class, 'store'])->name('furniture.store');
        Route::get('/furniture/{furniture}/edit', [FurnitureCatalogController::class, 'edit'])->name('furniture.edit');
        Route::put('/furniture/{furniture}', [FurnitureCatalogController::class, 'update'])->name('furniture.update');
        Route::delete('/furniture/{furniture}', [FurnitureCatalogController::class, 'destroy'])->name('furniture.destroy');
    });
});

require __DIR__.'/auth.php';
