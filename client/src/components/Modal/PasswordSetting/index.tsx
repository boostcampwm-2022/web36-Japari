/** @jsxImportSource @emotion/react */

import Input from "../../Input";
import Button from "../../Button";
import * as style from "./styles";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { socketState } from "../../../store/socket";

export interface PasswordSettingProps {
  closeModal: () => void;
  roomId: string;
}

const PasswordSetting = ({ closeModal, roomId }: PasswordSettingProps) => {
  const socket = useRecoilValue(socketState);
  const [password, setPassword] = useState<string>("");

  const submitPassword = () => {
    const data = { roomId, password };
    socket.emit("game-room/password", data);
    closeModal();
  };

  return (
    <>
      <Input type="password" placeholder="" setValue={setPassword} />
      <div css={style.footerStyle}>
        <Button buttonType="확인" handleClick={submitPassword} />
        <Button buttonType="닫기" handleClick={closeModal} />
      </div>
    </>
  );
};

export default PasswordSetting;
