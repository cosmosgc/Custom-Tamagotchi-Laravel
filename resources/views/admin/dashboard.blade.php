<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Admin Panel') }}
        </h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                    <a href="{{ route('admin.species.index') }}" class="block p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition">
                        <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ $speciesCount }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Species</div>
                    </a>
                    <a href="{{ route('admin.animations.index') }}" class="block p-4 bg-pink-50 dark:bg-pink-900/30 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/50 transition">
                        <div class="text-2xl font-bold text-pink-600 dark:text-pink-400">{{ $animationCount }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Animations</div>
                    </a>
                    <a href="{{ route('admin.dialogue.index') }}" class="block p-4 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition">
                        <div class="text-2xl font-bold text-green-600 dark:text-green-400">{{ $dialogueCount }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Dialogue Sets</div>
                    </a>
                    <a href="{{ route('admin.rooms.index') }}" class="block p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/50 transition">
                        <div class="text-2xl font-bold text-amber-600 dark:text-amber-400">{{ $roomCount }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Room Templates</div>
                    </a>
                    <a href="{{ route('admin.furniture.index') }}" class="block p-4 bg-teal-50 dark:bg-teal-900/30 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/50 transition">
                        <div class="text-2xl font-bold text-teal-600 dark:text-teal-400">{{ $furnitureCount }}</div>
                        <div class="text-sm text-gray-600 dark:text-gray-400">Furniture Items</div>
                    </a>
                </div>

                <div class="border-t pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <a href="{{ route('admin.species.create') }}" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300">
                            <span class="text-lg">+</span> Add New Species
                        </a>
                        <a href="{{ route('admin.furniture.create') }}" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300">
                            <span class="text-lg">+</span> Add Furniture Item
                        </a>
                        <a href="{{ route('admin.rooms.create') }}" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300">
                            <span class="text-lg">+</span> Add Room Template
                        </a>
                        <a href="{{ route('dashboard') }}" class="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 text-sm text-gray-700 dark:text-gray-300">
                            <span class="text-lg">&larr;</span> Back to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
