// Word list per spec.md. `nearMiss` is the plausible-confusion letter used
// as one of the three wrong answers (B/D, P/Q, C/G, M/N) — hardcoded per
// word rather than derived, per spec.
export const WORDS = [
  { emoji: '🍎', word: 'Apple', letter: 'A' },
  { emoji: '🍌', word: 'Banana', letter: 'B', nearMiss: 'D' },
  { emoji: '🐻', word: 'Bear', letter: 'B', nearMiss: 'D' },
  { emoji: '🐱', word: 'Cat', letter: 'C', nearMiss: 'G' },
  { emoji: '🐮', word: 'Cow', letter: 'C', nearMiss: 'G' },
  { emoji: '🐶', word: 'Dog', letter: 'D', nearMiss: 'B' },
  { emoji: '🦆', word: 'Duck', letter: 'D', nearMiss: 'B' },
  { emoji: '🥚', word: 'Egg', letter: 'E' },
  { emoji: '🐟', word: 'Fish', letter: 'F' },
  { emoji: '🦊', word: 'Fox', letter: 'F' },
  { emoji: '🐸', word: 'Frog', letter: 'F' },
  { emoji: '🐐', word: 'Goat', letter: 'G', nearMiss: 'C' },
  { emoji: '🍇', word: 'Grapes', letter: 'G', nearMiss: 'C' },
  { emoji: '🎩', word: 'Hat', letter: 'H' },
  { emoji: '🐴', word: 'Horse', letter: 'H' },
  { emoji: '🧊', word: 'Ice', letter: 'I' },
  { emoji: '🫙', word: 'Jar', letter: 'J' },
  { emoji: '🪁', word: 'Kite', letter: 'K' },
  { emoji: '🐨', word: 'Koala', letter: 'K' },
  { emoji: '🍋', word: 'Lemon', letter: 'L' },
  { emoji: '🦁', word: 'Lion', letter: 'L' },
  { emoji: '🥭', word: 'Mango', letter: 'M', nearMiss: 'N' },
  { emoji: '🐭', word: 'Mouse', letter: 'M', nearMiss: 'N' },
  { emoji: '🥜', word: 'Nut', letter: 'N', nearMiss: 'M' },
  { emoji: '🐙', word: 'Octopus', letter: 'O' },
  { emoji: '🍊', word: 'Orange', letter: 'O' },
  { emoji: '🍑', word: 'Peach', letter: 'P', nearMiss: 'Q' },
  { emoji: '🐷', word: 'Pig', letter: 'P', nearMiss: 'Q' },
  { emoji: '👑', word: 'Queen', letter: 'Q', nearMiss: 'P' },
  { emoji: '🐰', word: 'Rabbit', letter: 'R' },
  { emoji: '🌈', word: 'Rainbow', letter: 'R' },
  { emoji: '🐍', word: 'Snake', letter: 'S' },
  { emoji: '⭐', word: 'Star', letter: 'S' },
  { emoji: '🐯', word: 'Tiger', letter: 'T' },
  { emoji: '🍅', word: 'Tomato', letter: 'T' },
  { emoji: '☂️', word: 'Umbrella', letter: 'U' },
  { emoji: '🚐', word: 'Van', letter: 'V' },
  { emoji: '🐳', word: 'Whale', letter: 'W' },
  { emoji: '🐺', word: 'Wolf', letter: 'W' },
  { emoji: '🐃', word: 'Yak', letter: 'Y' },
  { emoji: '🦓', word: 'Zebra', letter: 'Z' },
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickWord(excludeWord) {
  const pool = excludeWord ? WORDS.filter((w) => w.word !== excludeWord) : WORDS
  return pool[Math.floor(Math.random() * pool.length)]
}

function randomChunk(length) {
  let s = ''
  for (let i = 0; i < length; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  return s
}

// The correct leading chunk of `letterCount` letters + 3 decoy chunks of the
// same length, shuffled. At letterCount 1 this is just entry.letter, and the
// nearMiss (B/D, P/Q, C/G, M/N) is used as one decoy same as before.
export function generateOptions(entry, letterCount = 1) {
  const correct = entry.word.slice(0, letterCount).toUpperCase()
  const pool = new Set()
  if (letterCount === 1 && entry.nearMiss) pool.add(entry.nearMiss)
  while (pool.size < 3) {
    const candidate = randomChunk(letterCount)
    if (candidate !== correct) pool.add(candidate)
  }
  return shuffle([correct, ...pool])
}
