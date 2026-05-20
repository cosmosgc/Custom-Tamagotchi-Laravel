<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DialogueLine;
use App\Models\CompanionSpecies;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DialogueLineController extends Controller
{
    public function index(): View
    {
        $dialogue = DialogueLine::with('species')->paginate(20);
        return view('admin.dialogue.index', compact('dialogue'));
    }

    public function create(): View
    {
        $species = CompanionSpecies::orderBy('name')->get();
        $moods = ['happy', 'neutral', 'sad', 'sleepy', 'hungry', 'greeting'];
        return view('admin.dialogue.create', compact('species', 'moods'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'species_id' => 'required|exists:companion_species,id',
            'mood' => 'required|string|max:50',
            'lines' => 'required|json',
        ]);

        $validated['lines'] = json_decode($validated['lines'], true);

        DialogueLine::create($validated);

        return redirect()->route('admin.dialogue.index')->with('success', 'Dialogue lines created.');
    }

    public function edit(DialogueLine $dialogue): View
    {
        $species = CompanionSpecies::orderBy('name')->get();
        $moods = ['happy', 'neutral', 'sad', 'sleepy', 'hungry', 'greeting'];
        return view('admin.dialogue.edit', compact('dialogue', 'species', 'moods'));
    }

    public function update(Request $request, DialogueLine $dialogue): RedirectResponse
    {
        $validated = $request->validate([
            'species_id' => 'required|exists:companion_species,id',
            'mood' => 'required|string|max:50',
            'lines' => 'required|json',
        ]);

        $validated['lines'] = json_decode($validated['lines'], true);

        $dialogue->update($validated);

        return redirect()->route('admin.dialogue.index')->with('success', 'Dialogue lines updated.');
    }

    public function destroy(DialogueLine $dialogue): RedirectResponse
    {
        $dialogue->delete();
        return redirect()->route('admin.dialogue.index')->with('success', 'Dialogue lines deleted.');
    }
}
