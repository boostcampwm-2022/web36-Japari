/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import ChatLog from "./ChatLog";
import ChatInput from "./ChatInput";
import * as style from "./styles";
import io from "socket.io-client";
import { socketState } from "../../store/socket";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

export type Chat = {
  sender: string;
  message: string;
  sendTime: string;
};

const Chatting = () => {
  const [logs, setLogs] = useState<Chat[]>([]);
  const socket = useRecoilValue(socketState);
  const [channel, setChannel] = useState("");
  const location = useLocation();

  const addLogs = (newLog: Chat) => {
    setLogs((current: Chat[]) => [...current, newLog]);
  };

  const checkLocation = () => {
    const currentPage = location.pathname.split("/").slice(1)[0];
    switch (currentPage) {
      case "lobby":
        setChannel("chat/lobby");
        return;
      case "waiting":
      case "playing":
        setChannel("chat/room");
        return;
    }
  };

  useEffect(() => {
    checkLocation();
  }, []);

  useEffect(() => {
    if (channel === "") return;
    socket.on(channel, addLogs);
    return () => {
      socket.off(channel, addLogs);
    };
  }, [channel]);

  return (
    <div css={style.ChattingContainerStyle}>
      <ChatLog logs={logs} />
      <hr css={style.ChattingHRStyle} />
      <ChatInput addLogs={addLogs} socket={socket} channel={channel} />
    </div>
  );
};

export default Chatting;
