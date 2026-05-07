import { useState, useMemo, useRef } from 'react'
import animeData from '../data/anime.json'
import { copyText } from '../utils.js'
import styles from './CategoryPage.module.css'

const GENRES = ['Action','Adventure','Avant Garde','Award Winning','Boys Love','Comedy','Drama','Fantasy','Girls Love','Gourmet','Horror','Mystery','Romance','Sci-Fi','Slice of Life','Sports','Supernatural','Suspense','Ecchi','Erotica','Hentai']
const THEMES = ['Adult Cast','Anthropomorphic','CGDCT','Childcare','Combat Sports','Crossdressing','Delinquents','Detective','Educational','Gag Humor','Gore','Harem','High Stakes Game','Historical','Idols (Female)','Idols (Male)','Isekai','Iyashikei','Love Polygon','Love Status Quo','Magical Sex Shift','Mahou Shoujo','Martial Arts','Mecha','Medical','Military','Music','Mythology','Organized Crime','Otaku Culture','Parody','Performing Arts','Pets','Psychological','Racing','Reincarnation','Reverse Harem','Samurai','School','Showbiz','Space','Strategy Game','Super Power','Survival','Team Sports','Time Travel','Urban Fantasy','Vampire','Video Game','Villainess','Visual Arts','Workplace']
const DEMOGRAPHICS = ['Josei','Kids','Seinen','Shoujo','Shounen']

const PAGE_SIZE = 50

function TagBtn({ label, active, onClick }) {
  return (
    <button
      className={`${styles.tagBtn} ${active ? styles.tagActive : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function CopyRow({ title }) {
  const [copied, setCopied] = useState(false)
  const t = useRef(null)
  const handle = () => {
    copyText(title).then(() => {
      setCopied(true)
      clearTimeout(t.current)
      t.current = setTimeout(() => setCopied(false), 1300)
    })
  }
  return (
    <tr className={styles.row}>
      <td className={styles.cellTitle}>{title}</td>
      <td className={styles.cellAction}>
        <button
          className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
          onClick={handle}
        >
          {copied ? '✓' : 'COPY'}
        </button>
      </td>
    </tr>
  )
}

export default function CategoryPage() {
  const [active, setActive] = useState(new Set())
  const [sortMode, setSortMode] = useState('az') // az | len-asc | len-desc
  const [page, setPage] = useState(1)

  const toggleTag = (tag) => {
    setActive(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
    setPage(1)
  }

  const filtered = useMemo(() => {
    if (active.size === 0) return []
    const tags = [...active]
    return animeData.filter(anime => {
      const allTags = [
        ...(anime.genres || []),
        ...(anime.themes || []),
        ...(anime.demographics || []),
      ]
      return tags.every(t => allTags.includes(t))
    })
  }, [active])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sortMode === 'az') return arr.sort((a, b) => a.title.localeCompare(b.title))
    if (sortMode === 'len-asc') return arr.sort((a, b) => {
      const wa = a.title.split(/\s+/).length, wb = b.title.split(/\s+/).length
      return wa !== wb ? wa - wb : a.title.localeCompare(b.title)
    })
    if (sortMode === 'len-desc') return arr.sort((a, b) => {
      const wa = a.title.split(/\s+/).length, wb = b.title.split(/\s+/).length
      return wa !== wb ? wb - wa : a.title.localeCompare(b.title)
    })
    return arr
  }, [filtered, sortMode])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageData = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const SortBtn = ({ mode, label }) => (
    <button
      className={`${styles.sortBtn} ${sortMode === mode ? styles.sortActive : ''}`}
      onClick={() => { setSortMode(mode); setPage(1) }}
    >
      {label}
    </button>
  )

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Tag groups */}
        <div className={styles.groups}>
          <div className={styles.group}>
            <span className={styles.groupLabel}>Genres</span>
            <div className={styles.tagGrid}>
              {GENRES.map(g => (
                <TagBtn key={g} label={g} active={active.has(g)} onClick={() => toggleTag(g)} />
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <span className={styles.groupLabel}>Themes</span>
            <div className={styles.tagGrid}>
              {THEMES.map(t => (
                <TagBtn key={t} label={t} active={active.has(t)} onClick={() => toggleTag(t)} />
              ))}
            </div>
          </div>

          <div className={styles.group}>
            <span className={styles.groupLabel}>Demographics</span>
            <div className={styles.tagGrid}>
              {DEMOGRAPHICS.map(d => (
                <TagBtn key={d} label={d} active={active.has(d)} onClick={() => toggleTag(d)} />
              ))}
            </div>
          </div>
        </div>

        {/* Search button + clear */}
        <div className={styles.actionRow}>
          <div className={styles.searchInfo}>
            {active.size > 0
              ? <span>{active.size} tag{active.size > 1 ? 's' : ''} selected → <strong>{filtered.length}</strong> results</span>
              : <span>Select tags to filter anime</span>
            }
          </div>
          {active.size > 0 && (
            <button className={styles.clearBtn} onClick={() => { setActive(new Set()); setPage(1) }}>
              Clear all
            </button>
          )}
        </div>

        {/* Results table */}
        {sorted.length > 0 && (
          <div className={styles.tableWrap}>
            <div className={styles.tableHeader}>
              <span className={styles.tableCount}>
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
              </span>
              <div className={styles.sortBtns}>
                <SortBtn mode="az" label="A–Z" />
                <SortBtn mode="len-asc" label="Shortest" />
                <SortBtn mode="len-desc" label="Longest" />
              </div>
            </div>

            <table className={styles.table}>
              <tbody>
                {pageData.map(a => <CopyRow key={a.id} title={a.title} />)}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ‹
                </button>
                <span className={styles.pageInfo}>
                  {page} / {totalPages}
                </span>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
