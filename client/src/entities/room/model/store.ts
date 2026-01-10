import { create } from "zustand"

interface RoomStore {
    roomParamId: string;
    userName: string;
    checkedRoom: string;
    setRoomParamId: (roomParamId: string) => void;
    setUserName: (userName: string) => void;
    setCheckedRoom: (checkedRoom: string) => void;
}

export const useRoomStore = create<RoomStore>((set => ({
    roomParamId: "",
    userName: "",
    checkedRoom: '',
    setRoomParamId: (roomParamId: string) => set({ roomParamId }),
    setUserName: (userName: string) => set({ userName }),
    setCheckedRoom: (checkedRoom: string) => set({ checkedRoom }),
})))
