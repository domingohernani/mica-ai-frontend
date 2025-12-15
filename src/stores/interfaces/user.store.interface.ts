import type { User } from "@/types/user.type";

// TODO: use User type later instead of an object
export interface UserStore {
  user: User | null;
  setUser: (data: User) => void;
}
