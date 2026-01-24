import { useEffect, useRef } from "react"

export const useDraggable = ({ isActive }: { isActive: boolean }) => {
    const isDragging = useRef(false)
    const dragRef = useRef<HTMLDivElement | null>(null)
    const startPosition = useRef({ x: 0, y: 0 })
    const position = useRef({ x: 0, y: 0 })

    const handleDragStart = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!dragRef.current || !isActive) return
        dragRef.current.style.cursor = "grabbing"
        startPosition.current = { x: e.clientX, y: e.clientY }
        isDragging.current = true
    }
    const handleDragEnd = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!dragRef.current || !isActive) return
        dragRef.current.style.cursor = "grab"
        isDragging.current = false
    }
    const checkEdge = () => {
        if (dragRef.current) {
            const rect = dragRef.current.getBoundingClientRect()
            if (rect.left < 20) {
                position.current = { x: position.current.x + 20, y: position.current.y }
            }
            if (rect.right > window.innerWidth - 10) {
                position.current = { x: position.current.x - 20, y: position.current.y }
            }
            if (rect.top < 20) {
                position.current = { x: position.current.x, y: position.current.y + 20 }
            }
            if (rect.bottom > window.innerHeight - 10) {
                position.current = { x: position.current.x, y: position.current.y - 20 }
            }
            dragRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
        }
    }

    const handleDrag = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!isDragging.current || !dragRef.current || !isActive) return
        checkEdge()
        const delta = { x: e.clientX - startPosition.current.x, y: e.clientY - startPosition.current.y }
        position.current = { x: position.current.x + delta.x, y: position.current.y + delta.y }
        dragRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
        startPosition.current = { x: e.clientX, y: e.clientY }
    }
    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault()
        if (!dragRef.current || !isActive) return
        dragRef.current.style.cursor = "grabbing"
        startPosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        isDragging.current = true
    }
    const handleTouchMove = (e: React.TouchEvent) => {
        e.preventDefault()
        if (!dragRef.current || !isActive) return
        checkEdge()
        const touch = e.touches[0]
        const delta = { x: touch.clientX - startPosition.current.x, y: touch.clientY - startPosition.current.y }
        position.current = { x: position.current.x + delta.x, y: position.current.y + delta.y }
        dragRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`
        startPosition.current = { x: touch.clientX, y: touch.clientY }
    }
    const handleTouchEnd = (e: React.TouchEvent) => {
        e.preventDefault()
        if (!dragRef.current || !isActive) return
        dragRef.current.style.cursor = "grab"
        isDragging.current = false
    }

    useEffect(() => {
        startPosition.current = { x: 0, y: 0 }
        position.current = { x: 0, y: 0 }
        if (!dragRef.current) return
        dragRef.current.style.transform = `translate(0px, 0px)`
    }, [isActive])

    return { dragRef, handleDragStart, handleDrag, handleDragEnd, handleTouchStart, handleTouchMove, handleTouchEnd }
}
