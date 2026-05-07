// ── Clipboard ──────────────────────────────────────────
export function copyText(text) {
  return navigator.clipboard.writeText(text)
}

// ── Sort helpers ────────────────────────────────────────
export function sortByLength(a, b) {
  const wa = a.title.trim().split(/\s+/).length
  const wb = b.title.trim().split(/\s+/).length
  if (wa !== wb) return wa - wb
  return a.title.localeCompare(b.title)
}

// ── Flip name (Last First ↔ First Last) ─────────────────
export function flipName(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2) return name
  // If exactly 2 parts, swap them
  // If more, move last word to front
  const last = parts[parts.length - 1]
  const rest = parts.slice(0, parts.length - 1).join(' ')
  return `${last} ${rest}`
}

// ── Unscramble ──────────────────────────────────────────
// Sort letters in a word
function sortWord(w) {
  return w.toLowerCase().replace(/[^a-z0-9]/g, '').split('').sort().join('')
}

// Given scrambled input (space-separated scrambled words),
// find titles where each word's sorted letters match
export function unscrambleSearch(input, data) {
  if (!input.trim()) return []

  const inputWords = input.trim().split(/\s+/)
  const inputSorted = inputWords.map(sortWord)

  return data.filter(anime => {
    const titleWords = anime.title.trim().split(/\s+/)
    if (titleWords.length !== inputWords.length) return false
    return titleWords.every((tw, i) => sortWord(tw) === inputSorted[i])
  }).sort(sortByLength)
}

// ── Acronym ─────────────────────────────────────────────
// Get first letter of each "word" in a title, ignoring symbols
// e.g. "Fullmetal Alchemist: Brotherhood" → "FAB"
function getTitleAcronym(title) {
  return title
    .trim()
    .split(/\s+/)
    .map(word => {
      // Strip leading symbols, grab first alphanumeric char
      const match = word.match(/[a-zA-Z0-9]/)
      return match ? match[0].toUpperCase() : null
    })
    .filter(Boolean)
    .join('')
}

export function acronymSearch(input, data) {
  if (!input.trim()) return []
  const q = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (!q) return []

  const exact = []
  const partial = []

  for (const anime of data) {
    const acro = getTitleAcronym(anime.title)
    if (acro === q) {
      exact.push({ ...anime, _acro: acro })
    } else if (acro.startsWith(q)) {
      partial.push({ ...anime, _acro: acro })
    }
  }

  exact.sort(sortByLength)
  partial.sort(sortByLength)

  return [...exact, ...partial]
}

// ── Tags helper ─────────────────────────────────────────
export function getAllTags(anime) {
  return [
    ...(anime.genres || []),
    ...(anime.themes || []),
    ...(anime.demographics || []),
  ]
}
