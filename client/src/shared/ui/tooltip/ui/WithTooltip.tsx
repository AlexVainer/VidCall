import { useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/shared/hooks'
import type { WithTooltipProps } from '../model/types'
import styles from './WithTooltip.module.scss'

export const WithTooltip = ({ children, content, gap = 100, transparent }: WithTooltipProps) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<'top' | 'bottom' | 'left' | 'right'>('bottom')
  const [visible, setVisible] = useState(false)

  const setSide = () => {
    const container = containerRef.current?.getBoundingClientRect()
    if (!container) return
    
    if (container.bottom + gap < window.innerHeight) {
      setPosition('bottom')
    } 
    else if (container.top - gap > 0) {
      setPosition('top')
    }
    else if (container.right + gap < window.innerWidth) {
      setPosition('right')
    }
    else if (container.left - gap > 0) {
      setPosition('left')
    }
    else {
      setPosition('bottom')
    }
  }

  const debouncedSetSide = useDebounce(setSide, 100)

  const handleClickOutside = (e: MouseEvent | TouchEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setVisible(false)
    }
  }

  useEffect(() => {
    const handleResize = () => debouncedSetSide()
    
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize, true)
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize, true)
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [debouncedSetSide])

  return (
    <div 
      className={`${styles.tooltip__container} ${visible ? styles.visible : ''}`} 
      ref={containerRef}
      onClick={() => setVisible(!visible)}
    >
      {children}
      <div 
        className={`${styles.tooltip__content} ${styles[position]}`} 
        ref={tooltipRef}
        style={{ pointerEvents: transparent ? 'none' : 'auto' }}
      >
        <div className={styles.tooltip__content__inner}>
          {content}
        </div>
      </div>
    </div>
  )
}