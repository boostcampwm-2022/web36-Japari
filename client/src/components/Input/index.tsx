/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import * as style from "./styles";

export interface InputProps {
  type: "text" | "password";
  width?: string;
  placeholder: string;
  disabled?: boolean;
  setValue: (value: string) => void;
}

const Input = ({ type, width, placeholder, disabled, setValue }: InputProps) => {
  return (
    <input
      css={css`
        ${style.inputStyle}
        width: ${width};
      `}
      type={type}
      placeholder={placeholder}
      disabled={disabled ?? false}
      onChange={e => setValue(e.target.value)}
    />
  );
};

export default Input;
