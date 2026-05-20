<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CompanionSpecies;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CompanionSpeciesController extends Controller
{
    public function index(): View
    {
        $species = CompanionSpecies::orderBy('name')->paginate(20);
        return view('admin.species.index', compact('species'));
    }

    public function create(): View
    {
        return view('admin.species.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'config_key' => 'required|string|max:255|unique:companion_species',
            'name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'default_colors' => 'nullable|json',
            'default_personality' => 'nullable|json',
            'favorite_foods' => 'nullable|json',
            'description' => 'nullable|string',
        ]);

        if (isset($validated['default_colors'])) {
            $validated['default_colors'] = json_decode($validated['default_colors'], true);
        }
        if (isset($validated['default_personality'])) {
            $validated['default_personality'] = json_decode($validated['default_personality'], true);
        }
        if (isset($validated['favorite_foods'])) {
            $validated['favorite_foods'] = json_decode($validated['favorite_foods'], true);
        }

        CompanionSpecies::create($validated);

        return redirect()->route('admin.species.index')->with('success', 'Species created.');
    }

    public function edit(CompanionSpecies $species): View
    {
        return view('admin.species.edit', compact('species'));
    }

    public function update(Request $request, CompanionSpecies $species): RedirectResponse
    {
        $validated = $request->validate([
            'config_key' => 'required|string|max:255|unique:companion_species,config_key,' . $species->id,
            'name' => 'required|string|max:255',
            'display_name' => 'required|string|max:255',
            'default_colors' => 'nullable|json',
            'default_personality' => 'nullable|json',
            'favorite_foods' => 'nullable|json',
            'description' => 'nullable|string',
        ]);

        if (isset($validated['default_colors'])) {
            $validated['default_colors'] = json_decode($validated['default_colors'], true);
        }
        if (isset($validated['default_personality'])) {
            $validated['default_personality'] = json_decode($validated['default_personality'], true);
        }
        if (isset($validated['favorite_foods'])) {
            $validated['favorite_foods'] = json_decode($validated['favorite_foods'], true);
        }

        $species->update($validated);

        return redirect()->route('admin.species.index')->with('success', 'Species updated.');
    }

    public function destroy(CompanionSpecies $species): RedirectResponse
    {
        $species->delete();
        return redirect()->route('admin.species.index')->with('success', 'Species deleted.');
    }
}
