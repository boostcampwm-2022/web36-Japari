import { Howl } from "howler";
import { atom } from "recoil";
import primaryBgm from "../assets/bgm/primary.mp3";

const sound = new Howl({
  src: [primaryBgm],
  loop: true,
  volume: 0.1,
});

const soundId = sound.play();

export const soundState = atom<[Howl, number, boolean]>({
  key: "bgmState",
  default: [sound, soundId, false],
  dangerouslyAllowMutability: true,
});
