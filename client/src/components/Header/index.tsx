/** @jsxImportSource @emotion/react */
import Logo from "../Logo";
import Logout from "./Logout";
import StatusMicCam from "./StatusMicCam";
import Button from "../Button";

import * as style from "./styles";

export interface HeaderProps {
  headerType: "로비" | "게임 대기실" | "게임 진행";
}

export const Header = ({ headerType }: HeaderProps) => (
  <header css={style.headerStyle}>
    <div>
      <Logo logoType="BOTH" />
    </div>
    <div css={style.headerRightStyle}>
      {headerType !== "로비" && <StatusMicCam micStatus={true} camStatus={true} />}
      {headerType !== "게임 진행" ? <Logout /> : <Button buttonType="방 나가기" handleClick={() => {}} />}
    </div>
  </header>
);
