/** @jsxImportSource @emotion/react */

import Input from "../../Input";
import Button from "../../Button";
import { useState } from "react";

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
    // 닉네임 설정 api

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
