# Animal Letter Game — Spec

2026-09-21 · @Someone

## Concept

A phonics game for a 5-year-old, built around animals. Each round shows a large animal emoji and the animal's name with its first letter missing. The player picks the correct first letter from four options.

The emoji is the clue — the kid already knows it's a Lion, so the task isn't reading, it's matching the sound "L-l-l-lion" to the letter shape. That's the right cognitive load for this age.

## Word List

| Emoji | Word | Letter |
| --- | --- | --- |
| 🍎 | Apple | A |
| 🍌 | Banana | B |
| 🐻 | Bear | B |
| 🐱 | Cat | C |
| 🐮 | Cow | C |
| 🐶 | Dog | D |
| 🦆 | Duck | D |
| 🥚 | Egg | E |
| 🐟 | Fish | F |
| 🦊 | Fox | F |
| 🐸 | Frog | F |
| 🐐 | Goat | G |
| 🍇 | Grapes | G |
| 🎩 | Hat | H |
| 🐴 | Horse | H |
| 🧊 | Ice | I |
| 🫙 | Jar | J |
| 🪁 | Kite | K |
| 🐨 | Koala | K |
| 🍋 | Lemon | L |
| 🦁 | Lion | L |
| 🥭 | Mango | M |
| 🐭 | Mouse | M |
| 🥜 | Nut | N |
| 🐙 | Octopus | O |
| 🍊 | Orange | O |
| 🍑 | Peach | P |
| 🐷 | Pig | P |
| 👑 | Queen | Q |
| 🐰 | Rabbit | R |
| 🌈 | Rainbow | R |
| 🐍 | Snake | S |
| ⭐ | Star | S |
| 🐯 | Tiger | T |
| 🍅 | Tomato | T |
| ☂️ | Umbrella | U |
| 🚐 | Van | V |
| 🐳 | Whale | W |
| 🐺 | Wolf | W |
| 🐃 | Yak | Y |
| 🦓 | Zebra | Z |

41 words covering A–Z (X excluded — no phonetically clean single-concept emoji exists for X). Letters with multiple entries (B, C, D, F, G, H, K, L, M, O, P, R, S, T, W) appear more often across rounds, which is fine.

Q note: "Queen" introduces Q via its name rather than a pure phoneme ("kw"). That's acceptable — Q is a weird letter and this is the conventional way kids first meet it.

All words are short and phonetically unambiguous. No silent letters, no digraphs where the written letter doesn't match the sound.

## Mechanics

**One round = 5 questions**, drawn randomly from the word list without repeats.

**Each question:**

1. Show large animal emoji (centred, takes up most of the screen)
2. Show the word with the first letter replaced by a blank: `_ion`
3. Show 4 large letter buttons: 1 correct + 3 distractors
4. Player taps a letter

**Distractors:** 2 random letters + 1 plausible near-miss (B/D, P/Q, C/G, M/N). Pick near-misses per word in the word list — don't generate them dynamically.

**On correct:** brief celebration (stars, colour burst), then auto-advance after \~1.5s.

**On wrong:** button shakes/flashes red, stays on the same question. No penalty, no strike counter — just try again.

**Shuffle button order** on each question so the correct answer isn't always in the same position.

## Audio

Use the **Web Speech API** — no external library needed.

**On question load:** speak the animal name (e.g. "Lion").

**On letter button tap:** speak the letter *sound*, not its name — "luh" not "el", "buh" not "bee". This is what makes it a phonics game rather than an alphabet game. Hardcode the phonetic pronunciations per letter in a lookup table.

**On correct:** short cheer phrase, e.g. "Yes! Well done!"

**On wrong:** nothing spoken — just the visual shake. Don't say "wrong" or "try again"; silence keeps it low-stakes.

Fallback gracefully if speech is unavailable (no error shown to the child).

## Feedback & Rewards

**Per question (correct):** stars or sparkles burst from the emoji, background flashes a happy colour for \~1s.

**End of round:** full-screen win screen with:

- Big animated trophy or star
- "You got X out of 5!"
- A "Play again" button that starts a fresh round with reshuffled questions

No score history, no leaderboard, no streaks. Complexity here is wasted on a 5-year-old — the win screen IS the reward, every time.

## Out of Scope

- **Math** — keep as a separate game later; mixing learning goals muddies both
- **Difficulty levels** — not needed yet; revisit when he's ready for middle or last letters
- **Progress tracking / accounts** — overkill
- **Multiplayer** — overkill
- **Alphabet letters beyond first-letter matching** — scope creep
