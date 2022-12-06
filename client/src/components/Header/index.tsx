/** @jsxImportSource @emotion/react */
import Logo from "../Logo";
import Logout from "./Logout";
import StatusMedia from "./StatusMedia";
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
      {["게임 대기실", "게임 진행"].includes(headerType) && <StatusMedia />}
      {["로비", "게임 대기실"].includes(headerType) && <Logout />}
      {["게임 진행"].includes(headerType) && <Button buttonType="방 나가기" handleClick={() => {}} />}
    </div>
  </header>
);
