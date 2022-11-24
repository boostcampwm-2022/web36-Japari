/** @jsxImportSource @emotion/react */

import Input from "../../Input";
import Button from "../../Button";
import { useState } from "react";

const NickNameSetting = () => {
  const [nickName, setNickName] = useState<string>("");
  return (
    <>
      <Input type="text" placeholder="" setValue={setNickName} />
      <Button buttonType="확인" handleClick={() => {}} />
    </>
  );
};

export default NickNameSetting;
