/** @jsxImportSource @emotion/react */
import { KeyboardEvent } from "react";
import { css } from "@emotion/react";
import * as style from "./styles";

export interface InputProps {
  type: "text" | "password";
  width?: string;
  placeholder: string;
  disabled?: boolean;
  value?: string;
  setValue: (value: string) => void;
  handleKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const Input = ({ type, width, placeholder, disabled, value, setValue, handleKeyPress }: InputProps) => {
  return (
    <input
      css={css`
        ${style.inputStyle}
        width: ${width};
      `}
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      disabled={disabled ?? false}
      onChange={e => setValue(e.target.value)}
      onKeyPress={handleKeyPress}
    />
  );
};

export default Input;
