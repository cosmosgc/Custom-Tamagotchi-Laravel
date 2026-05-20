<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Room Templates</h2>
            <a href="{{ route('admin.rooms.create') }}" class="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm">+ New Room</a>
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
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Config Key</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Size</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Grid</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($rooms as $room)
                            <tr class="border-b dark:border-gray-700">
                                <td class="py-2 text-gray-600 dark:text-gray-400 font-mono">{{ $room->config_key }}</td>
                                <td class="py-2 text-gray-900 dark:text-gray-100">{{ $room->name }}</td>
                                <td class="py-2 text-gray-600 dark:text-gray-400 text-xs">{{ $room->width }}x{{ $room->height }}</td>
                                <td class="py-2 text-gray-600 dark:text-gray-400 text-xs">{{ $room->grid_cols }}x{{ $room->grid_rows }} ({{ $room->cell_size }}px)</td>
                                <td class="py-2 flex gap-2">
                                    <a href="{{ route('admin.rooms.edit', $room) }}" class="text-amber-600 hover:text-amber-900 dark:hover:text-amber-400">Edit</a>
                                    <form method="POST" action="{{ route('admin.rooms.destroy', $room) }}" onsubmit="return confirm('Delete this room?')">
                                        @csrf @method('DELETE')
                                        <button class="text-red-600 hover:text-red-900 dark:hover:text-red-400">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="5" class="py-4 text-center text-gray-400">No room templates yet.</td></tr>
                        @endforelse
                    </tbody>
                </table>
                <div class="mt-4">{{ $rooms->links() }}</div>
            </div>
        </div>
    </div>
</x-app-layout>
