<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Animation Configs</h2>
            <a href="{{ route('admin.animations.create') }}" class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm">+ New Config</a>
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
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Species</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Spritesheets</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Animations</th>
                            <th class="pb-2 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($configs as $cfg)
                            <tr class="border-b dark:border-gray-700">
                                <td class="py-2 text-gray-900 dark:text-gray-100">{{ $cfg->species->name ?? 'N/A' }}</td>
                                <td class="py-2 text-gray-600 dark:text-gray-400 font-mono text-xs">{{ count($cfg->spritesheets ?? []) }} sheets</td>
                                <td class="py-2 text-gray-600 dark:text-gray-400 font-mono text-xs">{{ count($cfg->animations ?? []) }} anims</td>
                                <td class="py-2 flex gap-2">
                                    <a href="{{ route('admin.animations.edit', $cfg) }}" class="text-pink-600 hover:text-pink-900 dark:hover:text-pink-400">Edit</a>
                                    <form method="POST" action="{{ route('admin.animations.destroy', $cfg) }}" onsubmit="return confirm('Delete this config?')">
                                        @csrf @method('DELETE')
                                        <button class="text-red-600 hover:text-red-900 dark:hover:text-red-400">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="4" class="py-4 text-center text-gray-400">No animation configs yet.</td></tr>
                        @endforelse
                    </tbody>
                </table>
                <div class="mt-4">{{ $configs->links() }}</div>
            </div>
        </div>
    </div>
</x-app-layout>
