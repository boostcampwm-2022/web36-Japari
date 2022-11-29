/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import ChatLog from "./ChatLog";
import ChatInput from "./ChatInput";
import * as style from "./styles";
import io from "socket.io-client";

export type Chat = {
  sender: string;
  message: string;
  sendTime: string;
};

const socket = io(`${process.env.REACT_APP_SOCKET_SERVER_URL}`, {
  // websocket으로 먼저 연결 시도 후 실패 시 polling으로 연결
  transports: ["websocket", "polling"],
  autoConnect: false,
  query: {
    "user-id": 3,
  },
});

const Chatting = () => {
  const [logs, setLogs] = useState<Chat[]>([]);

  const addLogs = (newLog: Chat) => {
    setLogs((current: Chat[]) => [...current, newLog]);
  };

  useEffect(() => {
    socket.connect();
  }, []);

  useEffect(() => {
    socket.on("chat/lobby", (data: Chat) => {
      addLogs(data);
    });
  }, []);

  return (
    <div css={style.ChattingContainerStyle}>
      <ChatLog logs={logs} />
      <hr css={style.ChattingHRStyle} />
      <ChatInput addLogs={addLogs} socket={socket} />
    </div>
  );
};

export default Chatting;
