// TODO: use User type later instead of an object
export interface UserStore {
  user: object;
  setUser: (data: object) => void;
}
