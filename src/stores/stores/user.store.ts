import type { UserStore } from "@/stores/interfaces/user.store.interface";
import type { User } from "@/types/user.type";
import type { StateCreator } from "zustand";

export const user: StateCreator<UserStore> = (set) => ({
  user: null,
  setUser: (data: User) => set({ user: data }),
});
