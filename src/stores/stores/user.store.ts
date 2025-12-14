import type { UserStore } from "@/stores/interfaces/user.store.interface";
import type { StateCreator } from "zustand";

export const user: StateCreator<UserStore> = (set) => ({
  user: {},
  setUser: (data: Object) => set({ user: data }),
});
