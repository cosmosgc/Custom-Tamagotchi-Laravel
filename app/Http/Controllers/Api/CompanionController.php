<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Companion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanionController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $companion = $user->companion;

        if (!$companion) {
            $companion = Companion::create([
                'user_id' => $user->id,
                'coins' => 100,
            ]);
        }

        return response()->json(['data' => $companion]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'species' => 'sometimes|string|max:255',
            'hunger' => 'sometimes|numeric|min:0|max:100',
            'energy' => 'sometimes|numeric|min:0|max:100',
            'fun' => 'sometimes|numeric|min:0|max:100',
            'affection' => 'sometimes|numeric|min:0|max:100',
            'mood' => 'sometimes|string|max:50',
            'sleeping' => 'sometimes|boolean',
            'coins' => 'sometimes|integer|min:0',
        ]);

        $companion = $user->companion;

        if (!$companion) {
            $companion = Companion::create([
                'user_id' => $user->id,
                ...$validated,
            ]);
        } else {
            $companion->update($validated);
        }

        return response()->json(['data' => $companion]);
    }

    public function showUser(int $userId): JsonResponse
    {
        $companion = Companion::where('user_id', $userId)->first();

        if (!$companion) {
            return response()->json(['data' => null, 'message' => 'No companion found'], 404);
        }

        return response()->json(['data' => $companion]);
    }
}
