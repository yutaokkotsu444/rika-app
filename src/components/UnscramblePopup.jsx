import { useState, useRef } from 'react'
import { copyText, flipName, getAllTags } from '../utils.js'
import styles from './UnscramblePopup.module.css'

function CharRow({ name, animeTitle }) {
  const [flipped, setFlipped] = useState(false)
  const [copiedWhich, setCopiedWhich] = useState(null)
  const t = useRef(null)

  const parts = name.trim().split(/\s+/)
  const canFlip = parts.length >= 2
  const displayName = flipped ? flipName(name) : name

  const handleCopy = (which, text) => {
    copyText(text).then(() => {
      setCopiedWhich(which)
      clearTimeout(t.current)
      t.current = setTimeout(() => setCopiedWhich(null), 1400)
    })
  }

  return (
    <div className={styles.charRow}>
      <span className={styles.charDot} />
      <span className={styles.charName}>{displayName}</span>
      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${copiedWhich === 'copy' ? styles.btnCopied : ''}`}
          onClick={() => handleCopy('copy', displayName)}
          title="Copy name"
        >
          {copiedWhich === 'copy' ? '✓' : 'COPY'}
        </button>
        <button
          className={`${styles.actionBtn} ${styles.phase3Btn} ${copiedWhich === 'phase3' ? styles.phase3Copied : ''}`}
          onClick={() => handleCopy('phase3', `${displayName} - ${animeTitle}`)}
          title={`Copy: ${displayName} - ${animeTitle}`}
        >
          {copiedWhich === 'phase3' ? '✓' : 'PHASE 3'}
        </button>
        {canFlip && (
          <button
            className={styles.flipBtn}
            onClick={() => setFlipped(f => !f)}
            title="Flip name order"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default function UnscramblePopup({ anime, onClose }) {
  if (!anime) return null
  const tags = getAllTags(anime)

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <div className={styles.glow} />

        <div className={styles.section}>
          <span className={styles.sectionLabel}>Title</span>
          <span className={styles.titleText}>{anime.title}</span>
        </div>

        {anime.characters?.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Characters</span>
            <div className={styles.charList}>
              {anime.characters.map((char, i) => (
                <CharRow key={i} name={char} animeTitle={anime.title} />
              ))}
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Tags</span>
            <div className={styles.tags}>
              {tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag.toUpperCase()}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
