// Thin Web Speech API wrapper. Fails silently — a 5-year-old should never
// see an error just because their browser/OS lacks TTS.

// Priority order of known pleasant, clear en-* voices across platforms.
// getVoices() can return [] until the async 'voiceschanged' event fires
// (notably on Chrome), so this list is re-checked lazily on every speak
// call rather than resolved once at load.
const PREFERRED_VOICE_NAMES = [
  'Samantha', // macOS/iOS
  'Google US English', // Chrome
  'Microsoft Zira Desktop', // Windows (older)
  'Microsoft Zira Online (Natural) - English (United States)', // Windows (newer)
  'Karen', // macOS (Australian)
  'Moira', // macOS (Irish)
  'Tessa', // macOS (South African)
]

function pickVoice() {
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  for (const name of PREFERRED_VOICE_NAMES) {
    const match = voices.find((v) => v.name === name)
    if (match) return match
  }
  return voices.find((v) => v.lang?.startsWith('en')) || null
}

function speak(text, { rate = 0.9 } = {}) {
  try {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    const voice = pickVoice()
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
  } catch {
    // no-op: speech is a bonus, not a requirement
  }
}

export function speakWord(word) {
  speak(word)
}
