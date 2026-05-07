import { useState, useRef } from 'react'
import { copyText, flipName, getAllTags } from '../utils.js'
import styles from './AnimePopup.module.css'

function CopyableBtn({ getText, children }) {
  const [copied, setCopied] = useState(false)
  const t = useRef(null)
  const handle = () => {
    copyText(typeof getText === 'function' ? getText() : getText).then(() => {
      setCopied(true)
      clearTimeout(t.current)
      t.current = setTimeout(() => setCopied(false), 1300)
    })
  }
  return (
    <button className={`${styles.copyableBtn} ${copied ? styles.btnCopied : ''}`} onClick={handle}>
      {children}
      {copied && <span className={styles.copiedMark}>✓</span>}
    </button>
  )
}

function CharRow({ name }) {
  const [flipped, setFlipped] = useState(false)
  const parts = name.trim().split(/\s+/)
  const canFlip = parts.length >= 2
  const displayName = flipped ? flipName(name) : name

  return (
    <div className={styles.charRow}>
      <span className={styles.charDot} />
      <CopyableBtn getText={() => displayName}>
        {displayName}
      </CopyableBtn>
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
  )
}

export default function AnimePopup({ anime, onClose }) {
  if (!anime) return null
  const tags = getAllTags(anime)

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.popup}>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        {/* Blurred bg glow */}
        <div className={styles.glow} />

        <div className={styles.section}>
          <span className={styles.sectionLabel}>Title</span>
          <CopyableBtn getText={anime.title}>
            {anime.title}
          </CopyableBtn>
        </div>

        {anime.characters?.length > 0 && (
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Characters</span>
            <div className={styles.charList}>
              {anime.characters.map((char, i) => (
                <CharRow key={i} name={char} />
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
