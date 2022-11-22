/** @jsxImportSource @emotion/react */
import * as style from "./styles";

export interface InputProps {
  placeholder: "" | "메세지 입력하기..." | "방 이름을 입력해주세요." | "비밀번호를 입력해주세요.";
}

const Input = ({ placeholder }: InputProps) => {
  let styled = null;
  switch (placeholder) {
    case "":
      styled = [style.inputStyle, style.smallInputStyle];
      break;
    case "메세지 입력하기...":
      styled = [style.inputStyle, style.chatInputStyle];
      break;
    case "방 이름을 입력해주세요.":
      styled = [style.inputStyle, style.largeInputStyle];
      break;
    case "비밀번호를 입력해주세요.":
      styled = [style.inputStyle, style.largeInputStyle];
      break;
  }
  return <input css={styled} type="text" placeholder={placeholder} />;
};

export default Input;
