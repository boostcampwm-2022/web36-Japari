/** @jsxImportSource @emotion/react */
import Logo from "../Logo";
import Logout from "./Logout";
import StatusMedia from "./StatusMedia";
import Button from "../Button";
import bgmPauseIcon from "../../assets/icons/bgm-pause-icon.png";
import bgmPlayIcon from "../../assets/icons/bgm-play-icon.png";

import * as style from "./styles";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { soundState } from "../../store/sound";
import { useEffect, useState } from "react";

export interface HeaderProps {
  headerType: "랜딩" | "로비" | "게임 대기실" | "게임 진행";
}

export const Header = ({ headerType }: HeaderProps) => {
  const navigate = useNavigate();

  const [sound, soundId, isBgmMuted] = useRecoilValue(soundState);
  const setSoundState = useSetRecoilState(soundState);

  useEffect(() => {
    if (!isBgmMuted) {
      sound.play(soundId);
    } else {
      sound.pause(soundId);
    }
  }, [sound, isBgmMuted, soundId]);

  return (
    <header css={style.headerStyle}>
      <div css={style.headerLeftStyle}>
        <Logo logoType="BOTH" />
        <div css={style.audioControllerStyle}>
          <p>Chat (Menu) - Rest!</p>
        </div>
        <div css={style.bgmButtonStyle} onClick={() => setSoundState([sound, soundId, !isBgmMuted])}>
          <img src={isBgmMuted ? bgmPlayIcon : bgmPauseIcon} alt="bgm-control-button" />
        </div>
      </div>
      <div css={style.headerRightStyle}>
        {["게임 대기실", "게임 진행"].includes(headerType) && <StatusMedia />}
        {["로비", "게임 대기실"].includes(headerType) && <Logout />}
        {headerType === "게임 진행" && (
          <Button
            buttonType="방 나가기"
            handleClick={() => {
              navigate("/lobby");
            }}
          />
        )}
      </div>
    </header>
  );
};
