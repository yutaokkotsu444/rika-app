import { useState, useEffect, useRef } from 'react'
import animeData from '../data/anime.json'
import { sortByLength, copyText } from '../utils.js'
import styles from './FITBPage.module.css'

function WordToken({ word }) {
  const [copied, setCopied] = useState(false)
  const t = useRef(null)
  const handle = () => {
    copyText(word).then(() => {
      setCopied(true)
      clearTimeout(t.current)
      t.current = setTimeout(() => setCopied(false), 1300)
    })
  }
  return (
    <button className={`${styles.token} ${copied ? styles.tokenCopied : ''}`} onClick={handle} title={`Copy "${word}"`}>
      {word}
      {copied && <span className={styles.copiedMark}>✓</span>}
    </button>
  )
}

export default function FITBPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    const matches = animeData
      .filter(a => a.title.toLowerCase().includes(q))
    setResults([...matches].sort(sortByLength).slice(0, 8))
  }, [query])

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.searchBox}>
          <svg className={styles.icon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className={styles.input}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for anime..."
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          <button className={styles.goBtn}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {results.length > 0 && (
          <div className={styles.resultsWrap}>
            <span className={styles.resultsLabel}>Results</span>
            <ul className={styles.results}>
              {results.map(anime => (
                <li key={anime.id} className={styles.resultRow}>
                  <span className={styles.bullet}>•</span>
                  <div className={styles.tokenRow}>
                    {anime.title.trim().split(/\s+/).map((word, i) => (
                      <WordToken key={i} word={word} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <p className={styles.noResults}>No results found</p>
        )}
      </div>
    </div>
  )
}
