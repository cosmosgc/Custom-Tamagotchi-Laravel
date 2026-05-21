<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Companion;
use App\Models\FurnitureCatalog;
use App\Models\InventoryItem;
use App\Models\ItemEffect;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    public function catalog(): JsonResponse
    {
        $furniture = FurnitureCatalog::all()->map(fn ($f) => [
            'item_id' => $f->item_id,
            'item_type' => 'furniture',
            'label' => $f->label,
            'description' => $f->description,
            'price' => $f->price,
            'category' => 'furniture',
        ]);

        $consumables = ItemEffect::all()->map(fn ($e) => [
            'item_id' => $e->item_id,
            'item_type' => $e->item_type,
            'label' => $e->label,
            'description' => $e->description,
            'price' => $e->price,
            'category' => $e->item_type,
        ]);

        return response()->json(['data' => $furniture->concat($consumables)->values()]);
    }

    public function buy(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'item_id' => 'required|string',
            'item_type' => 'required|string',
        ]);

        $itemId = $validated['item_id'];
        $itemType = $validated['item_type'];

        $price = null;
        if ($itemType === 'furniture') {
            $item = FurnitureCatalog::where('item_id', $itemId)->first();
            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }
            $price = $item->price;
        } else {
            $item = ItemEffect::where('item_id', $itemId)->where('item_type', $itemType)->first();
            if (!$item) {
                return response()->json(['message' => 'Item not found'], 404);
            }
            $price = $item->price;
        }

        $companion = $user->companion;
        if (!$companion) {
            $companion = Companion::create(['user_id' => $user->id]);
        }

        if ($companion->coins < $price) {
            return response()->json(['message' => 'Not enough coins'], 422);
        }

        $companion->decrement('coins', $price);

        InventoryItem::updateOrCreate(
            ['user_id' => $user->id, 'item_id' => $itemId],
            ['item_type' => $itemType, 'quantity' => 1]
        );

        return response()->json([
            'data' => [
                'coins' => $companion->fresh()->coins,
                'item' => [
                    'item_id' => $itemId,
                    'item_type' => $itemType,
                    'quantity' => 1,
                ],
            ],
        ]);
    }
}
