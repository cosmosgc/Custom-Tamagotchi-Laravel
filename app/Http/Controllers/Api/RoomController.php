<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomLayout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $layout = $user->roomLayout;

        if (!$layout) {
            $layout = RoomLayout::create([
                'user_id' => $user->id,
                'room_id' => 'default',
                'furniture' => [
                    ['itemId' => 'bed', 'col' => 3, 'row' => 3, 'rotation' => 0],
                    ['itemId' => 'bowl', 'col' => 7, 'row' => 5, 'rotation' => 0],
                    ['itemId' => 'toy_box', 'col' => 8, 'row' => 2, 'rotation' => 0],
                ],
            ]);
        }

        return response()->json(['data' => $layout]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'room_id' => 'sometimes|string|max:255',
            'furniture' => 'sometimes|array',
            'furniture.*.itemId' => 'required|string',
            'furniture.*.col' => 'required|integer|min:0',
            'furniture.*.row' => 'required|integer|min:0',
            'furniture.*.rotation' => 'sometimes|integer|min:0',
        ]);

        $layout = $user->roomLayout;

        if (!$layout) {
            $layout = RoomLayout::create([
                'user_id' => $user->id,
                'room_id' => $validated['room_id'] ?? 'default',
                'furniture' => $validated['furniture'] ?? [],
            ]);
        } else {
            $layout->update($validated);
        }

        return response()->json(['data' => $layout]);
    }
}
