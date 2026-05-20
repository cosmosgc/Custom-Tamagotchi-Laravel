<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{{ isset($dialogue) ? 'Edit Dialogue Set' : 'Create Dialogue Set' }}</h2>
    </x-slot>
    <div class="py-6">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                <form method="POST" action="{{ isset($dialogue) ? route('admin.dialogue.update', $dialogue) : route('admin.dialogue.store') }}">
                    @csrf
                    @if(isset($dialogue)) @method('PUT') @endif
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Species</label>
                            <select name="species_id" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm">
                                @foreach($species as $s)
                                    <option value="{{ $s->id }}" {{ isset($dialogue) && $dialogue->species_id == $s->id ? 'selected' : '' }}>{{ $s->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Mood</label>
                            <select name="mood" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm">
                                @foreach($moods as $m)
                                    <option value="{{ $m }}" {{ isset($dialogue) && $dialogue->mood == $m ? 'selected' : '' }}>{{ $m }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="mt-4">
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Lines (JSON array of strings)</label>
                        <textarea name="lines" rows="8" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm font-mono">{{ isset($dialogue) ? json_encode($dialogue->lines, JSON_PRETTY_PRINT) : '["Hi there!","I\'m feeling okay.","Just hanging out."]' }}</textarea>
                    </div>
                    <div class="mt-6 flex gap-3">
                        <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">{{ isset($dialogue) ? 'Update' : 'Create' }}</button>
                        <a href="{{ route('admin.dialogue.index') }}" class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 text-sm">Cancel</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
