<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FurnitureCatalog;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $items = $user->inventory;
        return response()->json(['data' => $items]);
    }

    public function catalog(): JsonResponse
    {
        $catalog = FurnitureCatalog::all();
        return response()->json(['data' => $catalog]);
    }

    public function addItem(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'item_id' => 'required|string',
            'item_type' => 'sometimes|string',
            'quantity' => 'sometimes|integer|min:1',
        ]);

        $item = InventoryItem::updateOrCreate(
            [
                'user_id' => $user->id,
                'item_id' => $validated['item_id'],
            ],
            [
                'item_type' => $validated['item_type'] ?? 'furniture',
                'quantity' => $validated['quantity'] ?? 1,
            ]
        );

        return response()->json(['data' => $item]);
    }

    public function removeItem(Request $request, string $itemId): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $item = InventoryItem::where('user_id', $user->id)
            ->where('item_id', $itemId)
            ->first();

        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        if ($item->quantity > 1) {
            $item->decrement('quantity');
        } else {
            $item->delete();
        }

        return response()->json(['data' => $item->fresh() ?? ['item_id' => $itemId, 'quantity' => 0]]);
    }
}
