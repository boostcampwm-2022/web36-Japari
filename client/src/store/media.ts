import { atom } from "recoil";

export const audioState = atom({
  key: "audioState",
  default: true,
});

export const videoState = atom({
  key: "videoState",
  default: true,
});

export const streamState = atom<MediaStream | null>({
  key: "streamState",
  default: null,
});
