/** @jsxImportSource @emotion/react */
import Input from "../../Input";
import chatInputEnter from "../../../assets/icons/chat-input-enter.svg";
import * as style from "./styles";
import { useState } from "react";
import { Chat } from "..";
import { Socket } from "socket.io-client";

interface ChatInputProps {
  addLogs: (value: Chat) => void;
  socket: Socket;
  channel: string;
}

const ChatInput = ({ addLogs, socket, channel }: ChatInputProps) => {
  const [message, setMessage] = useState<string>("");

  const sendMessage = () => {
    if (message === "") {
      alert("메세지를 입력하세요");
      return;
    }
    const newLog: Chat = {
      sender: "ME",
      message,
      sendTime: new Date().toTimeString().split(" ")[0],
    };

    socket.emit(channel, newLog);
    addLogs(newLog);
    setMessage("");
  };

  const pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        width={"95%"}
      />
      <img src={chatInputEnter} alt="chatLogEnter" onClick={sendMessage} />
    </div>
  );
};

export default ChatInput;
