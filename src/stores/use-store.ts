import { user } from "@/stores/stores/user.store";
import { token } from "@/stores/stores/token.store";
import { organization } from "@/stores/stores/organization.store";
import type { UserStore } from "@/stores/interfaces/user.store.interface";
import type { TokenStore } from "@/stores/interfaces/token.store.interface";
import type { OrganizationStore } from "./interfaces/organization.store.interface";
import { create } from "zustand";

export const useStore = create<UserStore & TokenStore & OrganizationStore>(
  (...a) => ({
    ...user(...a),
    ...token(...a),
    ...organization(...a),
  }),
);
