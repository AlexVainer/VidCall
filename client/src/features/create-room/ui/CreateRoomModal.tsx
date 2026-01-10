import { Button, Input, Modal } from "@/shared"
import { useCreateRoomModal } from "../model/useCreateRoomModal"

import styles from './CreateRoomModal.module.scss'

export const CreateRoomModal = () => {
  const { name, error, handleInputChange, handleCreate, closeModal } = useCreateRoomModal()

  return (  
    <Modal onClose={closeModal}>
      <div className={styles.createRoom}>
        <Input 
          title="Enter your name" 
          placeholder="Your name" 
          error={error} 
          type="text" 
          value={name} 
          onChange={handleInputChange} 
        />
        <Button onClick={handleCreate}>Create Room</Button>
      </div>
    </Modal>
  )
}