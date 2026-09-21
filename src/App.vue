<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { pickWord, generateOptions } from './lib/words.js'
import { speakWord } from './lib/speech.js'

const CONFETTI_COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#eab308', '#14b8a6']
const CELEBRATE_MS = 3000
const BURST_INTERVAL_MS = 500

const entry = ref(pickWord())
const options = ref(generateOptions(entry.value))
const solved = ref(false)
const wrongId = ref(null)
const rootEl = ref(null)

const particles = ref([])
const confettiLaunched = ref(false)
const confettiOrigin = reactive({ x: 0, y: 0 })
let particleSeq = 0
let wrongTimeout = null
let celebrationTimers = []

function startRound(exclude) {
  clearTimeout(wrongTimeout)
  celebrationTimers.forEach(clearTimeout)
  celebrationTimers = []
  entry.value = pickWord(exclude)
  options.value = generateOptions(entry.value)
  solved.value = false
  wrongId.value = null
  particles.value = []
  speakWord(entry.value.word)
}

function celebrate(firstOrigin) {
  burstConfetti(firstOrigin)
  for (let elapsed = BURST_INTERVAL_MS; elapsed < CELEBRATE_MS; elapsed += BURST_INTERVAL_MS) {
    celebrationTimers.push(setTimeout(() => burstConfetti(), elapsed))
  }
  celebrationTimers.push(setTimeout(() => startRound(entry.value.word), CELEBRATE_MS))
}

function burstConfetti(origin) {
  if (origin) {
    confettiOrigin.x = origin.x
    confettiOrigin.y = origin.y
  } else if (rootEl.value) {
    const rootRect = rootEl.value.getBoundingClientRect()
    confettiOrigin.x = rootRect.width / 2 + (Math.random() - 0.5) * rootRect.width * 0.5
    confettiOrigin.y = rootRect.height * 0.3 + (Math.random() - 0.5) * 100
  }

  const batch = ++particleSeq
  const count = 70
  const next = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = 160 + Math.random() * 280
    const size = 6 + Math.random() * 8
    next.push({
      id: `${batch}-${i}`,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size,
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance - 60,
      rot: Math.random() * 1080 - 540,
      delayMs: Math.round(Math.random() * 100),
    })
  }
  confettiLaunched.value = false
  particles.value = next

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (particleSeq === batch) confettiLaunched.value = true
    })
  })

  setTimeout(() => {
    if (particleSeq === batch) particles.value = []
  }, 1000)
}

function handleTap(letter, event) {
  if (solved.value) return

  if (letter === entry.value.letter) {
    solved.value = true
    wrongId.value = null
    let origin = null
    if (event?.currentTarget && rootEl.value) {
      const btnRect = event.currentTarget.getBoundingClientRect()
      const rootRect = rootEl.value.getBoundingClientRect()
      origin = {
        x: btnRect.left + btnRect.width / 2 - rootRect.left,
        y: btnRect.top + btnRect.height / 2 - rootRect.top,
      }
    }
    celebrate(origin)
  } else {
    wrongId.value = letter
    clearTimeout(wrongTimeout)
    wrongTimeout = setTimeout(() => {
      wrongId.value = null
    }, 400)
  }
}

onMounted(() => speakWord(entry.value.word))
onBeforeUnmount(() => {
  clearTimeout(wrongTimeout)
  celebrationTimers.forEach(clearTimeout)
})
</script>

<template>
  <div
    ref="rootEl"
    class="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 pb-10 pt-8 transition-colors duration-300"
    :class="solved ? 'bg-emerald-50' : 'bg-slate-50'"
  >
    <!-- Confetti burst -->
    <div
      class="pointer-events-none absolute z-20"
      :style="{ left: confettiOrigin.x + 'px', top: confettiOrigin.y + 'px' }"
    >
      <span
        v-for="p in particles"
        :key="p.id"
        class="absolute left-0 top-0 rounded-sm"
        :style="{
          width: p.size + 'px',
          height: p.size + 'px',
          backgroundColor: p.color,
          opacity: confettiLaunched ? 0 : 1,
          transform: confettiLaunched
            ? `translate(${p.tx}px, ${p.ty}px) rotate(${p.rot}deg) scale(0.3)`
            : 'translate(0, 0) rotate(0deg) scale(1)',
          transition: `transform 0.9s cubic-bezier(0.15,0.8,0.25,1) ${p.delayMs}ms, opacity 0.9s ease-in ${p.delayMs}ms`,
        }"
      />
    </div>

    <h1 class="text-lg font-bold text-slate-400">Letters</h1>

    <!-- Emoji -->
    <div class="mt-4 text-[7rem] leading-none sm:text-[9rem]" :class="solved ? 'animate-pulsate' : ''">
      {{ entry.emoji }}
    </div>

    <!-- Word with blanked first letter -->
    <div class="mt-4 text-4xl font-extrabold lowercase tracking-wide text-slate-800 sm:text-5xl">
      <span v-if="solved" class="text-emerald-500">{{ entry.letter }}</span>
      <span v-else class="text-slate-500">_</span>{{ entry.word.slice(1) }}
    </div>

    <!-- Letter options -->
    <div class="mt-8 grid w-full max-w-xs grid-cols-2 gap-4">
      <button
        v-for="letter in options"
        :key="letter"
        :disabled="solved"
        @click="handleTap(letter, $event)"
        class="aspect-square rounded-3xl text-5xl font-extrabold lowercase shadow-sm transition-all duration-150 sm:text-6xl"
        :class="[
          solved && letter === entry.letter
            ? 'bg-emerald-400 text-white animate-pop'
            : wrongId === letter
              ? 'bg-rose-400 text-white animate-shake'
              : 'bg-white text-slate-800 hover:bg-indigo-50 active:scale-95 disabled:opacity-40',
        ]"
      >
        {{ letter }}
      </button>
    </div>
  </div>
</template>
