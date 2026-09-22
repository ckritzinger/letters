<script setup>
defineEmits(['play-again'])
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 px-4">
    <div
      class="flex w-full max-w-xs flex-col items-center rounded-3xl bg-white px-6 py-8 text-center shadow-xl animate-bounceIn"
    >
      <div class="text-7xl">🏆</div>
      <h2 class="mt-4 text-2xl font-extrabold text-slate-800">Well Done!</h2>

      <button
        @click="$emit('play-again')"
        class="mt-8 w-full rounded-2xl bg-indigo-500 py-4 text-xl font-extrabold text-white shadow-md transition hover:bg-indigo-600 active:scale-95"
      >
        ▶ Play Again
      </button>
    </div>
  </div>
</template>
