/** @jsxImportSource @emotion/react */
import Logo from "../Logo";
import Logout from "./Logout";
import StatusMicCam from "./StatusMicCam";
import Button from "../Button";

import * as style from "./styles";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import { useNavigate } from "react-router-dom";

export interface HeaderProps {
  headerType: "랜딩" | "로비" | "게임 대기실" | "게임 진행";
}

export const Header = ({ headerType }: HeaderProps) => {
  const navigate = useNavigate();
  const socket = useRecoilValue(socketState);

  return (
    <header css={style.headerStyle}>
      <div>
        <Logo logoType="BOTH" />
      </div>
      <div css={style.headerRightStyle}>
        {(headerType === "게임 대기실" || headerType === "게임 진행") && (
          <StatusMicCam micStatus={true} camStatus={true} />
        )}
        {(headerType === "로비" || headerType === "게임 대기실") && <Logout />}
        {headerType === "게임 진행" && (
          <Button
            buttonType="방 나가기"
            handleClick={() => {
              navigate("/lobby");
              socket.emit("game-room/exit");
            }}
          />
        )}
      </div>
    </header>
  );
};
