// Thin Web Speech API wrapper. Fails silently — a 5-year-old should never
// see an error just because their browser/OS lacks TTS.
function speak(text, { rate = 0.9 } = {}) {
  try {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    window.speechSynthesis.speak(utterance)
  } catch {
    // no-op: speech is a bonus, not a requirement
  }
}

export function speakWord(word) {
  speak(word)
}
