
export interface Message {
    id: string;
    text: string;
    type: 'system' | 'remote' | 'self';
    sendedAt: Date;
    files?: File[];
}

export interface ChatProps {
    isJoined: boolean
    isMediaReady: boolean
    isDataChanelReady: boolean
    emitMessage: (message: Message) => void
    isOpen: boolean
}
