/** @jsxImportSource @emotion/react */
import Logo from "../Logo";
import Logout from "./Logout";
import StatusMedia from "./StatusMedia";
import Button from "../Button";

import * as style from "./styles";
import { useNavigate } from "react-router-dom";

export interface HeaderProps {
  headerType: "랜딩" | "로비" | "게임 대기실" | "게임 진행";
}

export const Header = ({ headerType }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header css={style.headerStyle}>
      <div>
        <Logo logoType="BOTH" />
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
