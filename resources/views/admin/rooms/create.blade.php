<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{{ isset($room) ? 'Edit Room Template' : 'Create Room Template' }}</h2>
    </x-slot>
    <div class="py-6">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <form method="POST" action="{{ isset($room) ? route('admin.rooms.update', $room) : route('admin.rooms.store') }}">
                    @csrf
                    @if(isset($room)) @method('PUT') @endif
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Config Key</label>
                            <input type="text" name="config_key" value="{{ $room->config_key ?? '' }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                            <input type="text" name="name" value="{{ $room->name ?? '' }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Wall Color</label>
                            <input type="text" name="wall_color" value="{{ $room->wall_color ?? '#f5e6ca' }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Floor Color</label>
                            <input type="text" name="floor_color" value="{{ $room->floor_color ?? '#c4a882' }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Width</label>
                            <input type="number" name="width" value="{{ $room->width ?? 800 }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Height</label>
                            <input type="number" name="height" value="{{ $room->height ?? 600 }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Grid Columns</label>
                            <input type="number" name="grid_cols" value="{{ $room->grid_cols ?? 10 }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Grid Rows</label>
                            <input type="number" name="grid_rows" value="{{ $room->grid_rows ?? 8 }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cell Size (px)</label>
                            <input type="number" name="cell_size" value="{{ $room->cell_size ?? 64 }}" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm">
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Default Furniture (JSON array)</label>
                        <textarea name="default_furniture" rows="5" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-amber-500 focus:ring-amber-500 text-sm font-mono">{{ isset($room) ? json_encode($room->default_furniture, JSON_PRETTY_PRINT) : '[{"id":"bed","col":3,"row":3,"label":"Bed"},{"id":"bowl","col":7,"row":5,"label":"Food Bowl"},{"id":"toy_box","col":8,"row":2,"label":"Toy Box"}]' }}</textarea>
                    </div>
                    <div class="mt-6 flex gap-3">
                        <button type="submit" class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">{{ isset($room) ? 'Update' : 'Create' }}</button>
                        <a href="{{ route('admin.rooms.index') }}" class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-sm">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
