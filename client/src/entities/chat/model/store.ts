import { create } from "zustand"
import type { Message } from "./types"

interface RecivedFile {
    file: File;
    messageId: string;
}
interface ChatStore {
    messages: Message[];
    dataChannelState: 'open' | 'closed' | 'connecting' | 'failed';  
    emit: (message: Message) => void;
    files: RecivedFile[];
    addFile: ({ file, messageId }: RecivedFile) => void;
    clearData: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    dataChannelState: 'closed',
    emit: (message) => set((state) => ({ messages: [...state.messages, message] })),
    files: [],
    addFile: ({ file, messageId }) => set((state) => ({ files: [...state.files, { file, messageId }] })),
    clearData: () => set(() => ({ messages: [], files: [] }))
}))
