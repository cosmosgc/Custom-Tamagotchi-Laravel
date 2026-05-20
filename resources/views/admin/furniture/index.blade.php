<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Furniture Catalog</h2>
            <a href="{{ route('admin.furniture.create') }}" class="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">+ New Item</a>
        </div>
    </x-slot>
    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                @if(session('success'))
                    <div class="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm">{{ session('success') }}</div>
                @endif
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b dark:border-gray-700 text-left">
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Item ID</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Label</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Color</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Size</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Price</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Interactions</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($items as $item)
                            <tr class="border-b dark:border-gray-700">
                                <td class="py-2 text-gray-600 dark:text-gray-400 font-mono">{{ $item->item_id }}</td>
                                <td class="py-2 text-gray-900 dark:text-gray-100">{{ $item->label }}</td>
                                <td class="py-2"><span class="inline-block w-4 h-4 rounded" style="background:{{ $item->color }}"></span> <span class="font-mono text-xs">{{ $item->color }}</span></td>
                                <td class="py-2 text-gray-600 dark:text-gray-400 text-xs">{{ $item->width }}x{{ $item->height }}</td>
                                <td class="py-2 text-gray-600 dark:text-gray-400">{{ $item->price }} coins</td>
                                <td class="py-2 text-gray-600 dark:text-gray-400 text-xs">{{ implode(', ', $item->interactions ?? []) }}</td>
                                <td class="py-2 flex gap-2">
                                    <a href="{{ route('admin.furniture.edit', $item) }}" class="text-teal-600 hover:text-teal-900 dark:hover:text-teal-400">Edit</a>
                                    <form method="POST" action="{{ route('admin.furniture.destroy', $item) }}" onsubmit="return confirm('Delete this item?')">
                                        @csrf @method('DELETE')
                                        <button class="text-red-600 hover:text-red-900 dark:hover:text-red-400">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="7" class="py-4 text-center text-gray-400">No furniture items yet.</td></tr>
                        @endforelse
                    </tbody>
                </table>
                <div class="mt-4">{{ $items->links() }}</div>
            </div>
        </div>
    </div>
</x-app-layout>
