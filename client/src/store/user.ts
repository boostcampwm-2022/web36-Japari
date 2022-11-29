import { User } from "@dto";
import { atom } from "recoil";

export const userState = atom<User | null>({
  key: "user",
  default: null,
});
