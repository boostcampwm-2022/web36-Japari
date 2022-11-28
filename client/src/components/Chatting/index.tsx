/** @jsxImportSource @emotion/react */
import { useState } from "react";
import ChatLog from "./ChatLog";
import ChatInput from "./ChatInput";
import * as style from "./styles";

const dummyLog = [
  {
    sender: "user1",
    message: "안녕하세요",
    sendTime: new Date(),
  },
  {
    sender: "user2",
    message: "안녕하세요",
    sendTime: new Date(),
  },
  {
    sender: "user3",
    message: "안녕하세요",
    sendTime: new Date(),
  },
  {
    sender: "user4",
    message: "안",
    sendTime: new Date(),
  },
  {
    sender: "user5",
    message: "안녕하세요5555555",
    sendTime: new Date(),
  },
  {
    sender: "user6",
    message: "안녕하세요666666666666666666666666",
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

  const addLogs = (newLog: Chat) => {
    setLogs((current: Chat[]) => [...current, newLog]);
  };

  return (
    <div css={style.ChattingContainerStyle}>
      <ChatLog logs={logs} />
      <hr css={style.ChattingHRStyle} />
      <ChatInput addLogs={addLogs} />
    </div>
  );
};

export default Chatting;
