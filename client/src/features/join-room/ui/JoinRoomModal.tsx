import { Modal, Input, Button } from '@/shared'
import { useJoinRoom } from "../model/useJoinRoom"

export const JoinRoomModal = () => {
  const { 
    roomId, 
    name, 
    error, 
    isFromPage, 
    handleRoomIdChange, 
    handleNameChange, 
    handleJoin, 
    closeModal 
  } = useJoinRoom()

  return (
    <Modal onClose={closeModal} unclosable={isFromPage}>
      {!isFromPage && (
        <Input 
          title="Room ID" 
          placeholder="Room ID" 
          value={roomId} 
          onChange={handleRoomIdChange} 
          error={error}
        />
      )}
      
      <Input 
        title="Your name" 
        placeholder="Your name" 
        value={name} 
        onChange={handleNameChange} 
        error={error}
      />
      
      <Button 
        onClick={handleJoin} 
        disabled={(!roomId.trim() && !isFromPage) || !name.trim()}
      >
        Join Room
      </Button>
    </Modal>
  )
}