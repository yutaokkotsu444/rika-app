import { useState } from 'react'
import SearchPage from './pages/SearchPage.jsx'
import UnscramblePage from './pages/UnscramblePage.jsx'
import AcronymPage from './pages/AcronymPage.jsx'
import FITBPage from './pages/FITBPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import styles from './App.module.css'

const TABS = ['SEARCH', 'UNSCRAMBLE', 'ACRONYM', 'FITB', 'CATEGORY']

export default function App() {
  const [active, setActive] = useState('SEARCH')

  const renderPage = () => {
    switch (active) {
      case 'SEARCH':     return <SearchPage />
      case 'UNSCRAMBLE': return <UnscramblePage />
      case 'ACRONYM':    return <AcronymPage />
      case 'FITB':       return <FITBPage />
      case 'CATEGORY':   return <CategoryPage />
    }
  }

  return (
    <div className={styles.app}>
      {/* Video background — only on Search */}
      <div className={styles.bgLayer}>
        {active === 'SEARCH' && (
          <video className={styles.bgVideo}
  src="/bg.webm"
  autoPlay
  loop
  muted
  playsInline
  preload="auto"
  style={{ willChange: 'transform' }} />
        )}
        <div className={`${styles.bgOverlay} ${active !== 'SEARCH' ? styles.bgSolid : ''}`} />
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.navBtn} ${active === tab ? styles.navActive : ''}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Page */}
      <main className={styles.main} key={active}>
        {renderPage()}
      </main>
    </div>
  )
}
