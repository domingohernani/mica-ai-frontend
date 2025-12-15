import { user } from "@/stores/stores/user.store";
import { token } from "@/stores/stores/token.store";
import type { UserStore } from "@/stores/interfaces/user.store.interface";
import type { TokenStore } from "@/stores/interfaces/token.store.interface";
import { create } from "zustand";

export const useStore = create<UserStore & TokenStore>((...a) => ({
  ...user(...a),
  ...token(...a),
}));
