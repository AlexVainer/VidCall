import { create } from "zustand"
import type { Message } from "./types"

interface ChatStore {
    messages: Message[];
    dataChannelState: 'open' | 'closed' | 'connecting' | 'failed';  
    emit: (message: Message) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    dataChannelState: 'closed',
    emit: (message) => set((state) => ({ messages: [...state.messages, message] })),
}))

