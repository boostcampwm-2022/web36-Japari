/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as style from "./styles";

export interface InputProps {
  type: "text" | "password";
  width?: string;
  placeholder: string;
}

const Input = ({ type, width, placeholder }: InputProps) => {
  return (
    <input
      css={css`
        ${style.inputStyle}
        width: ${width};
      `}
      type={type}
      placeholder={placeholder}
    />
  );
};

export default Input;
