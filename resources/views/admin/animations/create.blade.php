<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{{ isset($animation) ? 'Edit Animation Config' : 'Create Animation Config' }}</h2>
    </x-slot>
    <div class="py-6">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <form method="POST" action="{{ isset($animation) ? route('admin.animations.update', $animation) : route('admin.animations.store') }}">
                    @csrf
                    @if(isset($animation)) @method('PUT') @endif
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Species</label>
                        <select name="species_id" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm">
                            @foreach($species as $s)
                                <option value="{{ $s->id }}" {{ isset($animation) && $animation->species_id == $s->id ? 'selected' : '' }}>{{ $s->name }} ({{ $s->config_key }})</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Spritesheets (JSON)</label>
                        <textarea name="spritesheets" rows="6" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm font-mono">{{ isset($animation) ? json_encode($animation->spritesheets, JSON_PRETTY_PRINT) : '[{"id":"body","src":"imagesExample/182528.png","frameWidth":32,"frameHeight":32,"rows":10,"cols":10},{"id":"expressions","src":"imagesExample/182839.png","frameWidth":32,"frameHeight":32,"rows":11,"cols":11}]' }}</textarea>
                    </div>
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Animations (JSON)</label>
                        <textarea name="animations" rows="10" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm font-mono">{{ isset($animation) ? json_encode($animation->animations, JSON_PRETTY_PRINT) : '{"idle":{"spritesheet":"body","frames":[0,1,2,1],"speed":0.12,"loop":true},"happy":{"spritesheet":"body","frames":[5,6,7,6,5],"speed":0.1,"loop":true},"sleep":{"spritesheet":"expressions","frames":[0,1,0,1],"speed":0.2,"loop":true}}' }}</textarea>
                    </div>
                    <div class="flex gap-3">
                        <button type="submit" class="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 text-sm">{{ isset($animation) ? 'Update' : 'Create' }}</button>
                        <a href="{{ route('admin.animations.index') }}" class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-sm">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
