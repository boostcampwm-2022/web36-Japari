/** @jsxImportSource @emotion/react */

import Input from "../../Input";
import Button from "../../Button";
import { useState } from "react";
import { updateNickname } from "../../../api/user";

interface NickNameSettingProps {
  closeModal: () => void;
}

const NickNameSetting = ({ closeModal }: NickNameSettingProps) => {
  const [nickName, setNickName] = useState<string>("");

  const handleSubmitButton = () => {
    if (nickName === "") {
      alert("닉네임을 입력하세요.");
      return;
    }

    updateNickname(nickName).catch(err => {
      alert("닉네임 설정에 실패하였습니다.");
      return;
    });
    alert("닉네임 설정이 완료되었습니다.");

    closeModal();
  };

  return (
    <>
      <Input type="text" placeholder="" value={nickName} setValue={setNickName} />
      <Button buttonType="확인" handleClick={handleSubmitButton} />
    </>
  );
};

export default NickNameSetting;
