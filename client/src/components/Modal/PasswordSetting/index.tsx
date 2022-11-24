/** @jsxImportSource @emotion/react */

import Input from "../../Input";
import Button from "../../Button";
import * as style from "./styles";
import { useState } from "react";

const PasswordSetting = () => {
  const [password, setPassword] = useState<string>("");
  return (
    <>
      <Input type="password" placeholder="" setValue={setPassword} />
      <div css={style.footerStyle}>
        <Button buttonType="확인" handleClick={() => {}} />
        <Button buttonType="닫기" handleClick={() => {}} />
      </div>
    </>
  );
};

export default PasswordSetting;
