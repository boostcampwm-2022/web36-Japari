/** @jsxImportSource @emotion/react */
import Logo from "../Logo";
import Logout from "./Logout";
import StatusMicCam from "./StatusMicCam";
import Button from "../Button";

import * as style from "./styles";

export interface HeaderProps {
  headerType: "랜딩" | "로비" | "게임 대기실" | "게임 진행";
}

export const Header = ({ headerType }: HeaderProps) => (
  <header css={style.headerStyle}>
    <div>
      <Logo logoType="BOTH" />
    </div>
    <div css={style.headerRightStyle}>
      {(headerType === "게임 대기실" || headerType === "게임 진행") && (
        <StatusMicCam micStatus={true} camStatus={true} />
      )}
      {(headerType === "로비" || headerType === "게임 대기실") && <Logout />}
      {headerType === "게임 진행" && <Button buttonType="방 나가기" handleClick={() => {}} />}
    </div>
  </header>
);
