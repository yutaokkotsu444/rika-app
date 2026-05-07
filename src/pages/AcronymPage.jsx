import { useState, useEffect } from 'react'
import animeData from '../data/anime.json'
import { acronymSearch, copyText } from '../utils.js'
import styles from './GamePage.module.css'

function ResultRow({ anime }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    copyText(anime.title).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1300)
    })
  }

  return (
    <li className={styles.resultRow}>
      <span className={styles.bullet}>•</span>
      <button
        className={`${styles.titleBtn} ${copied ? styles.titleBtnCopied : ''}`}
        onClick={handleCopy}
        title="Click to copy"
      >
        {anime.title}
        {copied && <span className={styles.copiedMark}>✓</span>}
      </button>
    </li>
  )
}

export default function AcronymPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    setResults(acronymSearch(query, animeData))
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
            onChange={e => setQuery(e.target.value.toUpperCase())}
            placeholder="Type acronym e.g. TTIGRAAS..."
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
              {results.map(a => (
                <ResultRow key={a.id} anime={a} />
              ))}
            </ul>
          </div>
        )}

        {query.trim() && results.length === 0 && (
          <p className={styles.noResults}>No matches found</p>
        )}
      </div>
    </div>
  )
}
