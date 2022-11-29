/** @jsxImportSource @emotion/react */
import Input from "../../Input";
import chatInputEnter from "../../../assets/icons/chat-input-enter.svg";
import * as style from "./styles";
import { useState, KeyboardEvent } from "react";
import { Chat } from "..";

interface ChatInputProps {
  addLogs: (value: Chat) => void;
  pressEnter: (e: KeyboardEvent<HTMLInputElement>) => void;
  message: string;
  setMessage: (value: string) => void;
  sendMessage: React.MouseEventHandler<HTMLImageElement>;
}

const ChatInput = ({ addLogs, pressEnter, message, setMessage, sendMessage }: ChatInputProps) => {
  return (
    <div css={style.ChatInputContainerStyle}>
      <Input
        type="text"
        placeholder="메세지 입력하기..."
        value={message}
        setValue={setMessage}
        handleKeyPress={pressEnter}
      />
      <img src={chatInputEnter} alt="chatLogEnter" onClick={sendMessage} />
    </div>
  );
};

export default ChatInput;
