<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class RoomTemplateController extends Controller
{
    public function index(): View
    {
        $rooms = RoomTemplate::orderBy('name')->paginate(20);
        return view('admin.rooms.index', compact('rooms'));
    }

    public function create(): View
    {
        return view('admin.rooms.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'config_key' => 'required|string|max:255|unique:room_templates',
            'name' => 'required|string|max:255',
            'wall_color' => 'required|string|max:7',
            'floor_color' => 'required|string|max:7',
            'width' => 'required|integer|min:100',
            'height' => 'required|integer|min:100',
            'grid_cols' => 'required|integer|min:1',
            'grid_rows' => 'required|integer|min:1',
            'cell_size' => 'required|integer|min:16',
            'default_furniture' => 'nullable|json',
        ]);

        if (isset($validated['default_furniture'])) {
            $validated['default_furniture'] = json_decode($validated['default_furniture'], true);
        }

        RoomTemplate::create($validated);

        return redirect()->route('admin.rooms.index')->with('success', 'Room template created.');
    }

    public function edit(RoomTemplate $room): View
    {
        return view('admin.rooms.edit', compact('room'));
    }

    public function update(Request $request, RoomTemplate $room): RedirectResponse
    {
        $validated = $request->validate([
            'config_key' => 'required|string|max:255|unique:room_templates,config_key,' . $room->id,
            'name' => 'required|string|max:255',
            'wall_color' => 'required|string|max:7',
            'floor_color' => 'required|string|max:7',
            'width' => 'required|integer|min:100',
            'height' => 'required|integer|min:100',
            'grid_cols' => 'required|integer|min:1',
            'grid_rows' => 'required|integer|min:1',
            'cell_size' => 'required|integer|min:16',
            'default_furniture' => 'nullable|json',
        ]);

        if (isset($validated['default_furniture'])) {
            $validated['default_furniture'] = json_decode($validated['default_furniture'], true);
        }

        $room->update($validated);

        return redirect()->route('admin.rooms.index')->with('success', 'Room template updated.');
    }

    public function destroy(RoomTemplate $room): RedirectResponse
    {
        $room->delete();
        return redirect()->route('admin.rooms.index')->with('success', 'Room template deleted.');
    }
}
