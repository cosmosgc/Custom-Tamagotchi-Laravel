<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AnimationConfig;
use App\Models\CompanionSpecies;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AnimationConfigController extends Controller
{
    public function index(): View
    {
        $configs = AnimationConfig::with('species')->paginate(20);
        return view('admin.animations.index', compact('configs'));
    }

    public function create(): View
    {
        $species = CompanionSpecies::orderBy('name')->get();
        return view('admin.animations.create', compact('species'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'species_id' => 'required|exists:companion_species,id',
            'spritesheets' => 'required|json',
            'animations' => 'required|json',
        ]);

        $validated['spritesheets'] = json_decode($validated['spritesheets'], true);
        $validated['animations'] = json_decode($validated['animations'], true);

        AnimationConfig::create($validated);

        return redirect()->route('admin.animations.index')->with('success', 'Animation config created.');
    }

    public function edit(AnimationConfig $animation): View
    {
        $species = CompanionSpecies::orderBy('name')->get();
        return view('admin.animations.edit', compact('animation', 'species'));
    }

    public function update(Request $request, AnimationConfig $animation): RedirectResponse
    {
        $validated = $request->validate([
            'species_id' => 'required|exists:companion_species,id',
            'spritesheets' => 'required|json',
            'animations' => 'required|json',
        ]);

        $validated['spritesheets'] = json_decode($validated['spritesheets'], true);
        $validated['animations'] = json_decode($validated['animations'], true);

        $animation->update($validated);

        return redirect()->route('admin.animations.index')->with('success', 'Animation config updated.');
    }

    public function destroy(AnimationConfig $animation): RedirectResponse
    {
        $animation->delete();
        return redirect()->route('admin.animations.index')->with('success', 'Animation config deleted.');
    }
}
