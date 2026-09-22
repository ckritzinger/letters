<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import { pickWord, generateOptions } from './lib/words.js'
import { speakWord } from './lib/speech.js'
import { getSettings, saveSettings } from './lib/storage.js'
import Welcome from './components/Welcome.vue'
import Settings from './components/Settings.vue'
import SuccessPopup from './components/SuccessPopup.vue'

const CONFETTI_COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#eab308', '#14b8a6']
const CELEBRATE_MS = 3000
const BURST_INTERVAL_MS = 500
const WRONG_LOCK_MS = 2000

const screen = ref('welcome')
const settingsReturnTo = ref('welcome')
const settings = ref(getSettings())
const entry = ref(pickWord())
const options = ref(generateOptions(entry.value, settings.value.letterCount))
const correctChunk = computed(() => entry.value.word.slice(0, settings.value.letterCount).toUpperCase())
const solved = ref(false)
const showPopup = ref(false)
const wrongId = ref(null)
const locked = ref(false)
const rootEl = ref(null)

const particles = ref([])
const confettiLaunched = ref(false)
const confettiOrigin = reactive({ x: 0, y: 0 })
const pulseScale = ref(1)
let particleSeq = 0
let wrongTimeout = null
let celebrationTimers = []
let pulseInterval = null

function startRound(exclude) {
  clearTimeout(wrongTimeout)
  celebrationTimers.forEach(clearTimeout)
  celebrationTimers = []
  stopPulse()
  entry.value = pickWord(exclude)
  options.value = generateOptions(entry.value, settings.value.letterCount)
  solved.value = false
  showPopup.value = false
  wrongId.value = null
  locked.value = false
  particles.value = []
  speakWord(entry.value.word)
}

function celebrate(firstOrigin) {
  burstConfetti(firstOrigin)
  for (let elapsed = BURST_INTERVAL_MS; elapsed < CELEBRATE_MS; elapsed += BURST_INTERVAL_MS) {
    celebrationTimers.push(setTimeout(() => burstConfetti(), elapsed))
  }
  celebrationTimers.push(
    setTimeout(() => {
      stopPulse()
      showPopup.value = true
    }, CELEBRATE_MS),
  )
  startPulse()
}

function playAgain() {
  startRound(entry.value.word)
}

// JS-driven inline transform, not a Tailwind/CSS @keyframes animation —
// mirrors the confetti technique above, which is the proven-working
// pattern for one-off effects in this codebase (see x-blitz's CLAUDE.md).
function startPulse() {
  let up = true
  pulseScale.value = 1.3
  pulseInterval = setInterval(() => {
    up = !up
    pulseScale.value = up ? 1.3 : 1
  }, 300)
}

function stopPulse() {
  if (pulseInterval) clearInterval(pulseInterval)
  pulseInterval = null
  pulseScale.value = 1
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

function handleTap(chunk, event) {
  if (solved.value || locked.value) return

  if (chunk === correctChunk.value) {
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
    wrongId.value = chunk
    locked.value = true
    clearTimeout(wrongTimeout)
    wrongTimeout = setTimeout(() => {
      wrongId.value = null
      locked.value = false
    }, WRONG_LOCK_MS)
  }
}

function startGame() {
  entry.value = pickWord()
  options.value = generateOptions(entry.value, settings.value.letterCount)
  screen.value = 'game'
  speakWord(entry.value.word)
}

function updateSettings(next) {
  settings.value = next
  saveSettings(next)
}

function openSettings(from) {
  settingsReturnTo.value = from
  screen.value = 'settings'
}

onBeforeUnmount(() => {
  clearTimeout(wrongTimeout)
  celebrationTimers.forEach(clearTimeout)
  stopPulse()
})
</script>

<template>
  <Welcome v-if="screen === 'welcome'" @play="startGame" @settings="openSettings('welcome')" />

  <Settings
    v-else-if="screen === 'settings'"
    :settings="settings"
    @back="screen = settingsReturnTo"
    @update-settings="updateSettings"
  />

  <div
    v-else
    ref="rootEl"
    class="relative flex min-h-[100dvh] flex-col items-center overflow-hidden px-4 pb-10 pt-8 transition-colors duration-300"
    :class="[solved ? 'bg-emerald-50' : 'bg-slate-50', locked && 'animate-shake']"
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
    <div
      class="mt-4 text-[7rem] leading-none sm:text-[9rem]"
      :style="{ transform: `scale(${pulseScale})`, transition: 'transform 0.3s ease-in-out' }"
    >
      {{ entry.emoji }}
    </div>

    <!-- Word with blanked leading letters -->
    <div class="mt-4 text-4xl font-extrabold lowercase tracking-wide text-slate-800 sm:text-5xl">
      <span v-if="solved" class="text-emerald-500">{{ correctChunk }}</span>
      <span v-else class="text-slate-500">{{ '_'.repeat(settings.letterCount) }}</span>{{ entry.word.slice(settings.letterCount) }}
    </div>

    <!-- Letter options -->
    <div class="mt-8 grid w-full max-w-xs grid-cols-2 gap-4">
      <button
        v-for="chunk in options"
        :key="chunk"
        :disabled="solved || locked"
        @click="handleTap(chunk, $event)"
        class="aspect-square rounded-3xl font-extrabold lowercase shadow-sm transition-all duration-150"
        :class="[
          settings.letterCount === 1 ? 'text-5xl sm:text-6xl' : 'text-3xl sm:text-4xl',
          solved && chunk === correctChunk
            ? 'bg-emerald-400 text-white animate-pop'
            : wrongId === chunk
              ? 'bg-rose-400 text-white animate-shake'
              : 'bg-white text-slate-800 hover:bg-indigo-50 active:scale-95 disabled:opacity-40',
        ]"
      >
        {{ chunk }}
      </button>
    </div>

    <SuccessPopup v-if="showPopup" @play-again="playAgain" @settings="openSettings('game')" />

    <!-- Wrong-tap lockout -->
    <div
      v-if="locked"
      class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/20"
    >
      <span class="text-8xl">⛔</span>
    </div>
  </div>
</template>
