const SETTINGS_KEY = 'letters_settings'

const DEFAULT_SETTINGS = {
  letterCount: 1,
}

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    // no-op: settings just won't persist across sessions
  }
}
