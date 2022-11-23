/** @jsxImportSource @emotion/react */

import Input from "../../Input";
import Button from "../../Button";
import * as style from "./styles";

const PasswordSetting = () => {
  return (
    <>
      <Input type="password" placeholder="" />
      <div css={style.footerStyle}>
        <Button buttonType="확인" handleClick={() => {}} />
        <Button buttonType="닫기" handleClick={() => {}} />
      </div>
    </>
  );
};

export default PasswordSetting;
