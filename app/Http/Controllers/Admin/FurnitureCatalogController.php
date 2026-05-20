<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FurnitureCatalog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class FurnitureCatalogController extends Controller
{
    public function index(): View
    {
        $items = FurnitureCatalog::orderBy('label')->paginate(20);
        return view('admin.furniture.index', compact('items'));
    }

    public function create(): View
    {
        return view('admin.furniture.create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|string|max:255|unique:furniture_catalog',
            'label' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'required|string|max:7',
            'width' => 'required|integer|min:1',
            'height' => 'required|integer|min:1',
            'interactions' => 'nullable|json',
            'price' => 'required|integer|min:0',
        ]);

        if (isset($validated['interactions'])) {
            $validated['interactions'] = json_decode($validated['interactions'], true);
        } else {
            $validated['interactions'] = [];
        }

        FurnitureCatalog::create($validated);

        return redirect()->route('admin.furniture.index')->with('success', 'Furniture item created.');
    }

    public function edit(FurnitureCatalog $furniture): View
    {
        return view('admin.furniture.edit', compact('furniture'));
    }

    public function update(Request $request, FurnitureCatalog $furniture): RedirectResponse
    {
        $validated = $request->validate([
            'item_id' => 'required|string|max:255|unique:furniture_catalog,item_id,' . $furniture->id,
            'label' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'color' => 'required|string|max:7',
            'width' => 'required|integer|min:1',
            'height' => 'required|integer|min:1',
            'interactions' => 'nullable|json',
            'price' => 'required|integer|min:0',
        ]);

        if (isset($validated['interactions'])) {
            $validated['interactions'] = json_decode($validated['interactions'], true);
        } else {
            $validated['interactions'] = [];
        }

        $furniture->update($validated);

        return redirect()->route('admin.furniture.index')->with('success', 'Furniture item updated.');
    }

    public function destroy(FurnitureCatalog $furniture): RedirectResponse
    {
        $furniture->delete();
        return redirect()->route('admin.furniture.index')->with('success', 'Furniture item deleted.');
    }
}
