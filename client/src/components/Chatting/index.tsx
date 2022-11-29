/** @jsxImportSource @emotion/react */
import { useState } from "react";
import ChatLog from "./ChatLog";
import ChatInput from "./ChatInput";
import * as style from "./styles";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";

const dummyLog = [
  {
    sender: "user1",
    message: "안녕하세요",
    sendTime: new Date(),
  },
];

export type Chat = {
  sender: string;
  message: string;
  sendTime: Date;
};

const Chatting = () => {
  const [logs, setLogs] = useState<Chat[]>(dummyLog);
  const [message, setMessage] = useState<string>("");
  const socket = useRecoilValue(socketState);

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

    socket.emit("chat/lobby", newLog);
    setMessage("");
  };

  const pressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const addLogs = (newLog: Chat) => {
    setLogs((current: Chat[]) => [...current, newLog]);
    console.log(logs);
  };

  return (
    <div css={style.ChattingContainerStyle}>
      <ChatLog logs={logs} />
      <hr css={style.ChattingHRStyle} />
      <ChatInput
        addLogs={addLogs}
        sendMessage={sendMessage}
        pressEnter={pressEnter}
        message={message}
        setMessage={setMessage}
      />
    </div>
  );
};

export default Chatting;
