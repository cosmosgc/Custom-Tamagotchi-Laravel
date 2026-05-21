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

            <div class="space-y-4" x-data="shopData()">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-4">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold text-lg text-gray-900 dark:text-gray-100">{{ __('Coins') }}</h3>
                        <span id="coin-display" class="text-lg font-bold text-yellow-500">0</span>
                    </div>
                </div>

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

                <div class="flex gap-2">
                    <button @click="openShop = true" class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
                        {{ __('Shop') }}
                    </button>
                    <button id="save-now-btn" class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                        {{ __('Save Now') }}
                    </button>
                </div>

                <!-- Shop Modal -->
                <template x-teleport="body">
                    <div x-show="openShop" class="fixed inset-0 z-50 flex items-center justify-center" x-cloak>
                        <div class="fixed inset-0 bg-black/50" @click="openShop = false"></div>
                        <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto mx-4 p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ __('Shop') }}</h2>
                                <span class="text-sm text-yellow-500 font-semibold">🪙 <span x-text="coins"></span></span>
                            </div>

                            <div class="flex gap-2 mb-4">
                                <template x-for="cat in ['all', 'furniture', 'food', 'toy']" :key="cat">
                                    <button @click="category = cat" class="px-3 py-1 rounded text-xs font-medium transition-colors"
                                        :class="category === cat ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'"
                                        x-text="cat.charAt(0).toUpperCase() + cat.slice(1)"></button>
                                </template>
                            </div>

                            <div class="space-y-3">
                                <template x-for="item in filteredItems" :key="item.item_id">
                                    <div class="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700">
                                        <div class="flex-1 min-w-0">
                                            <p class="font-medium text-gray-900 dark:text-gray-100 text-sm" x-text="item.label"></p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate" x-text="item.description || ''"></p>
                                            <p class="text-xs text-yellow-500 mt-0.5">🪙 <span x-text="item.price"></span></p>
                                        </div>
                                        <button @click="buy(item)" :disabled="coins < item.price"
                                            class="ml-3 px-3 py-1.5 rounded text-xs font-medium shrink-0 transition-colors"
                                            :class="coins >= item.price ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'">
                                            Buy
                                        </button>
                                    </div>
                                </template>
                                <p x-show="!filteredItems.length" class="text-gray-400 text-sm text-center py-4">{{ __('No items in this category.') }}</p>
                            </div>

                            <button @click="openShop = false" class="mt-4 w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
                                {{ __('Close') }}
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <script>
        function shopData() {
            return {
                openShop: false,
                coins: 0,
                category: 'all',
                items: [],
                get filteredItems() {
                    if (this.category === 'all') return this.items;
                    return this.items.filter(i => i.category === this.category);
                },
                init() {
                    window.__shopRefreshCoins = (c) => { this.coins = c; };
                    window.__shopSetItems = (items) => { this.items = items; };
                },
                async buy(item) {
                    if (this.coins < item.price) return;
                    try {
                        const res = await fetch('/tamagotchi-maker/public/api/shop/buy', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                            },
                            body: JSON.stringify({ item_id: item.item_id, item_type: item.item_type }),
                        });
                        const json = await res.json();
                        if (res.ok && json.data) {
                            this.coins = json.data.coins;
                            if (window.__shopRefreshInventory) window.__shopRefreshInventory();
                        } else {
                            alert(json.message || 'Purchase failed');
                        }
                    } catch {
                        alert('Failed to buy item');
                    }
                },
            };
        }
    </script>
</x-app-layout>
