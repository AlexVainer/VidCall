import { create } from "zustand"

interface RoomStore {
    roomParamId: string;
    userName: string;
    checkedRoom: string;
    role: 'host' | 'guest' | null;
    setRoomParamId: (roomParamId: string) => void;
    setUserName: (userName: string) => void;
    setCheckedRoom: (checkedRoom: string) => void;
    setRole: (role: 'host' | 'guest') => void;
}

export const useRoomStore = create<RoomStore>((set => ({
    roomParamId: "",
    userName: "",
    checkedRoom: '',
    role: null,
    setRoomParamId: (roomParamId: string) => set({ roomParamId }),
    setUserName: (userName: string) => set({ userName }),
    setCheckedRoom: (checkedRoom: string) => set({ checkedRoom }),
    setRole: (role: 'host' | 'guest') => set({ role }),
})))
