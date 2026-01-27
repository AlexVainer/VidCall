import { useCallback, useRef } from "react"

export const useDebounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number = 300
) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }
      timer.current = setTimeout(() => {
        func(...args)
      }, delay)
    },
    [func, delay]
  )
}