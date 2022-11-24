/** @jsxImportSource @emotion/react */
import Input from "../../Input";
import chatInputEnter from "../../../assets/icons/chat-input-enter.svg";
import * as style from "./styles";
import { useState } from "react";

const ChatInput = () => {
  const [message, setMessage] = useState<string>("");
  return (
    <div css={style.ChatInputContainerStyle}>
      <Input type="text" placeholder="메세지 입력하기..." setValue={setMessage} />
      <img src={chatInputEnter} alt="chatLogEnter" />
    </div>
  );
};

export default ChatInput;
