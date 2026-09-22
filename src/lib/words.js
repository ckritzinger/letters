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
const VOWELS = 'AEIOU'.split('')

// Consonants a 5-year-old plausibly mixes up — shape (M/N, B/D/P/Q), sound
// (C/G/K, F/V, T/D, S/Z), or both. Used to make multi-letter decoy chunks
// look close to the real answer instead of random noise.
const CLOSE_CONSONANTS = {
  B: ['D', 'P'],
  D: ['B', 'P'],
  P: ['Q', 'B'],
  Q: ['P', 'D'],
  M: ['N'],
  N: ['M'],
  C: ['G', 'K'],
  G: ['C'],
  K: ['C', 'G'],
  F: ['V'],
  V: ['F', 'W'],
  W: ['V'],
  T: ['D'],
  S: ['Z'],
  Z: ['S'],
  L: ['R'],
  R: ['L'],
}

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

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Swap the letter at `index` for a plausibly-confusable one: another vowel
// for a vowel, a close consonant for a consonant.
function swapLetter(chars, index) {
  const ch = chars[index]
  if (VOWELS.includes(ch)) {
    chars[index] = pickRandom(VOWELS.filter((v) => v !== ch))
  } else {
    const alternatives = CLOSE_CONSONANTS[ch] || ALPHABET.filter((a) => a !== ch)
    chars[index] = pickRandom(alternatives)
  }
}

// Swap the position of two letters within the chunk.
function scrambleLetters(chars) {
  if (chars.length < 2) return
  const i = Math.floor(Math.random() * chars.length)
  let j = Math.floor(Math.random() * chars.length)
  while (j === i) j = Math.floor(Math.random() * chars.length)
  ;[chars[i], chars[j]] = [chars[j], chars[i]]
}

// Start from the correct chunk and apply exactly one transformation (vowel
// swap, close-consonant swap, or letter scramble) so decoys look like
// plausible near-misses instead of random letter soup.
function makeDecoy(correct) {
  const chars = correct.split('')
  if (chars.length >= 2 && Math.random() < 0.35) {
    scrambleLetters(chars)
  } else {
    swapLetter(chars, Math.floor(Math.random() * chars.length))
  }
  return chars.join('')
}

// The correct leading chunk of `letterCount` letters + 3 decoy chunks of the
// same length, shuffled.
export function generateOptions(entry, letterCount = 1) {
  const correct = entry.word.slice(0, letterCount).toUpperCase()
  const pool = new Set()

  // Single-letter mode keeps the original curated nearMiss + random letters.
  if (letterCount === 1) {
    if (entry.nearMiss) pool.add(entry.nearMiss)
    while (pool.size < 3) {
      const candidate = randomChunk(1)
      if (candidate !== correct) pool.add(candidate)
    }
    return shuffle([correct, ...pool])
  }

  let attempts = 0
  while (pool.size < 3 && attempts < 50) {
    attempts++
    const candidate = makeDecoy(correct)
    if (candidate !== correct) pool.add(candidate)
  }
  while (pool.size < 3) {
    const candidate = randomChunk(letterCount)
    if (candidate !== correct) pool.add(candidate)
  }
  return shuffle([correct, ...pool])
}
