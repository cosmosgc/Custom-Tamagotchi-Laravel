<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Tamagotchi Maker') }}
        </h2>
    </x-slot>

    <div class="py-6">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div class="lg:col-span-3">
                <div id="game-container" class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 text-gray-900 dark:text-gray-100 text-center">
                        {{ __("Loading your companion...") }}
                    </div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4">
                    <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">{{ __('Other Tamagotchis') }}</h3>
                    <div id="user-list" class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <p class="text-gray-400">{{ __('Loading...') }}</p>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4">
                    <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">{{ __('Inventory') }}</h3>
                    <div id="inventory-list" class="text-sm text-gray-600 dark:text-gray-300">
                        <p class="text-gray-400">{{ __('No items yet') }}</p>
                    </div>
                </div>

                <button id="save-now-btn" class="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                    {{ __('Save Now') }}
                </button>
            </div>
        </div>
    </div>
</x-app-layout>
