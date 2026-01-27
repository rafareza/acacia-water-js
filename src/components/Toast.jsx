import { useState, useEffect } from 'react'
import './Toast.css'

export function Toast({ message, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div className="toast">
      <span>✓</span>
      <p>{message}</p>
    </div>
  )
}
