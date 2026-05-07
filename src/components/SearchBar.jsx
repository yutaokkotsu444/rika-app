import styles from './SearchBar.module.css'

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className={styles.wrap}>
      <svg className={styles.icon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus
        spellCheck={false}
        autoComplete="off"
      />
      <button className={styles.goBtn} type="button">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    </div>
  )
}
