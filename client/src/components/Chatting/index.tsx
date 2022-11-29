/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import ChatLog from "./ChatLog";
import ChatInput from "./ChatInput";
import * as style from "./styles";
import io from "socket.io-client";

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

const socket = io(`${process.env.REACT_APP_SOCKET_SERVER_URL}`, {
  // websocket으로 먼저 연결 시도 후 실패 시 polling으로 연결
  transports: ["websocket", "polling"],
  autoConnect: false,
});

const Chatting = () => {
  const [logs, setLogs] = useState<Chat[]>(dummyLog);
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

  useEffect(() => {
    socket.connect();
  }, []);

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
