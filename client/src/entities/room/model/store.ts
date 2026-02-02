import { create } from "zustand"

interface RoomStore {
    roomParamId: string;
    userName: string;
    checkedRoom: string | null;
    role: 'host' | 'guest' | null;
    setRoomParamId: (roomParamId: string) => void;
    setUserName: (userName: string) => void;
    setCheckedRoom: (checkedRoom: string | null) => void;
    setRole: (role: 'host' | 'guest' | null) => void;
    joinedRoom: boolean;
    setJoinedRoom: (joinedRoom: boolean) => void;
}

export const useRoomStore = create<RoomStore>((set => ({
    roomParamId: "",
    userName: "",
    checkedRoom: null,
    role: null,
    joinedRoom: false,
    setRoomParamId: (roomParamId: string) => set({ roomParamId }),
    setUserName: (userName: string) => set({ userName }),
    setCheckedRoom: (checkedRoom: string | null) => set({ checkedRoom }),
    setRole: (role: 'host' | 'guest' | null) => set({ role }),
    setJoinedRoom: (joinedRoom: boolean) => set({ joinedRoom }),
})))
