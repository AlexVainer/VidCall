interface RoomSize {
    size: number
}
export const checkRoomExists = async (roomId: string): Promise<RoomSize | void> => {
    try {
        const response = await fetch('/api/room-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomId }),
        })
        const data = await response.json()
        return data
    } catch (error) {
        return 
    }
}
