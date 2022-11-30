/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import ChatLog from "./ChatLog";
import ChatInput from "./ChatInput";
import * as style from "./styles";
import io from "socket.io-client";
import { socketState } from "../../store/socket";

import { useRecoilValue } from "recoil";

export type Chat = {
  sender: string;
  message: string;
  sendTime: string;
};

const Chatting = () => {
  const [logs, setLogs] = useState<Chat[]>([]);
  const socket = useRecoilValue(socketState);
  const addLogs = (newLog: Chat) => {
    setLogs((current: Chat[]) => [...current, newLog]);
  };

  useEffect(() => {
    socket.on("chat/lobby", addLogs);
    return () => {
      socket.off("chat/lobby", addLogs);
    };
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
