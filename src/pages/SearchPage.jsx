import { useState, useEffect } from 'react'
import animeData from '../data/anime.json'
import AnimePopup from '../components/AnimePopup.jsx'
import styles from './SearchPage.module.css'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const q = query.toLowerCase()
    setResults(
      animeData.filter(a => a.title.toLowerCase().includes(q)).slice(0, 5)
    )
  }, [query])

  return (
    <div className={styles.page}>
      <div className={styles.center}>
        <img src="/rikalogo.png" alt="RIKA" className={styles.logo} />

        <div className={styles.searchWrap}>
          <div className={`${styles.searchBox} ${results.length > 0 ? styles.searchBoxOpen : ''}`}>
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
            <ul className={styles.dropdown}>
              {results.map(a => (
                <li
                  key={a.id}
                  className={styles.dropItem}
                  onClick={() => { setSelected(a); setQuery('') ; setResults([]) }}
                >
                  {a.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {selected && (
        <AnimePopup anime={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
