import { useState, useRef } from 'react'
import { copyText } from '../utils.js'
import styles from './CopyButton.module.css'

export default function CopyButton({ getText, label = 'COPY', className = '' }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef(null)

  const handle = () => {
    const text = typeof getText === 'function' ? getText() : getText
    copyText(text).then(() => {
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1400)
    })
  }

  return (
    <button
      className={`${styles.btn} ${copied ? styles.copied : ''} ${className}`}
      onClick={handle}
      title="Copy to clipboard"
    >
      {copied ? '✓' : label}
    </button>
  )
}
