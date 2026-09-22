<script setup>
import { reactive, watch } from 'vue'

const MIN_LETTERS = 1
const MAX_LETTERS = 3

const props = defineProps({
  settings: { type: Object, required: true },
})
const emit = defineEmits(['back', 'update-settings'])

const local = reactive({ ...props.settings })

watch(
  local,
  (val) => {
    const letterCount = Math.max(MIN_LETTERS, Math.min(Number(val.letterCount) || MIN_LETTERS, MAX_LETTERS))
    emit('update-settings', { letterCount })
  },
  { deep: true },
)
</script>

<template>
  <div class="flex min-h-[100dvh] flex-col items-center bg-slate-50 px-4 py-10">
    <button
      @click="emit('back')"
      class="self-start rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-500 shadow-sm hover:bg-slate-100"
    >
      ← Back
    </button>

    <h1 class="mt-4 text-2xl font-extrabold text-slate-800">Settings</h1>

    <div class="mt-6 w-full max-w-sm rounded-2xl bg-white p-6 shadow-sm">
      <div class="flex items-center justify-between gap-3">
        <label class="text-sm font-semibold text-slate-600">Letters to guess</label>
        <div class="flex items-center gap-3">
          <button
            @click="local.letterCount = Math.max(MIN_LETTERS, local.letterCount - 1)"
            class="h-10 w-10 rounded-xl bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95"
          >
            −
          </button>
          <span class="w-6 text-center text-xl font-extrabold text-slate-800">{{ local.letterCount }}</span>
          <button
            @click="local.letterCount = Math.min(MAX_LETTERS, local.letterCount + 1)"
            class="h-10 w-10 rounded-xl bg-slate-100 text-xl font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95"
          >
            +
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
