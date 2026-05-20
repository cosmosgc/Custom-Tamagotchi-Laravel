<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $users = User::where('id', '!=', $user->id)
            ->select('id', 'name')
            ->get();

        return response()->json(['data' => $users]);
    }

    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $data = $user->load(['companion', 'roomLayout']);
        return response()->json(['data' => $data]);
    }
}
