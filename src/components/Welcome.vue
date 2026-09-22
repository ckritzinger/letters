<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { WORDS } from '../lib/words.js'

defineEmits(['play', 'settings'])

const CYCLE_MS = 2000
const FADE_MS = 500

const index = ref(Math.floor(Math.random() * WORDS.length))
const visible = ref(true)
let intervalId = null
let fadeTimeout = null

onMounted(() => {
  intervalId = setInterval(() => {
    visible.value = false
    fadeTimeout = setTimeout(() => {
      index.value = (index.value + 1) % WORDS.length
      visible.value = true
    }, FADE_MS)
  }, CYCLE_MS)
})
onBeforeUnmount(() => {
  clearInterval(intervalId)
  clearTimeout(fadeTimeout)
})
</script>

<template>
  <div class="relative flex min-h-[100dvh] flex-col items-center justify-center bg-slate-50 px-4">
    <button
      @click="$emit('settings')"
      aria-label="Settings"
      class="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
        <path
          fill-rule="evenodd"
          d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.243.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.274.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.274.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <div
      class="text-[7rem] leading-none transition-opacity duration-500"
      :class="visible ? 'opacity-100' : 'opacity-0'"
    >
      {{ WORDS[index].emoji }}
    </div>
    <h1 class="mt-4 text-4xl font-extrabold text-slate-800">Letters</h1>
    <p class="mt-2 text-slate-500">Learn your ABCs with animals!</p>

    <button
      @click="$emit('play')"
      class="mt-10 w-full max-w-xs rounded-3xl bg-indigo-500 py-4 text-2xl font-extrabold text-white shadow-md transition active:scale-95"
    >
      ▶ Play
    </button>
  </div>
</template>
