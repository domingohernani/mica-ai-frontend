import type { TokenStore } from "@/stores/interfaces/token.store.interface";
import type { StateCreator } from "zustand";

export const token: StateCreator<TokenStore> = (set) => ({
  token: "",
  setToken: (data: string) => set({ token: data }),
});
