import { create } from "zustand";
import Member from "../class/member";

interface StoreState {
  user: Member;
  setUser: (name: string) => void;
}

const useStore = create<StoreState>()((set, get) => ({
  user: new Member("annonymous"),
  setUser: (name: string) => {
    set({
      user: new Member(name),
    });
  },
}));

export default useStore;
