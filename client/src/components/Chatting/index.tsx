/** @jsxImportSource @emotion/react */
import { useState } from "react";
import ChatLog from "./ChatLog";
import ChatInput from "./ChatInput";
import * as style from "./styles";
import { dummyLog } from "./ChatLog/index.stories";

export type Chat = {
  sender: string;
  message: string;
  sendTime: Date;
};

const Chatting = () => {
  const [logs, setLogs] = useState<Chat[]>(dummyLog);

  return (
    <div css={style.ChattingContainerStyle}>
      <ChatLog logs={logs} />
      <hr css={style.ChattingHRStyle} />
      <ChatInput />
    </div>
  );
};

export default Chatting;
