/** @jsxImportSource @emotion/react */
import Input from "../../Input";
import chatInputEnter from "../../../assets/icons/chat-input-enter.svg";
import * as style from "./styles";
import { useState, KeyboardEvent } from "react";
import { Chat } from "..";

interface ChatInputProps {
  addLogs: (value: Chat) => void;
}

const ChatInput = ({ addLogs }: ChatInputProps) => {
  const [message, setMessage] = useState<string>("");

  const sendMessage = () => {
    if (message === "") {
      alert("메세지를 입력하세요");
      return;
    }
    const newLog: Chat = {
      sender: "me",
      message,
      sendTime: new Date(),
    };

    addLogs(newLog);

    // socket.emit('send_message', newLog)

    setMessage("");
  };

  const pressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

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
