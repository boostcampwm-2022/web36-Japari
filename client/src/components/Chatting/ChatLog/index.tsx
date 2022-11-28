/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import { Chat } from "..";
import * as style from "./styles";

export interface ChatLogProps {
  logs: Chat[];
}

const ChatLog = ({ logs }: ChatLogProps) => {
  const messageBoxRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    // socket.on('receive_chat', newChat)
    return () => {
      // socket.off('receive_chat')
    };
  }, []);

  return (
    <div css={style.ChatLogContainerStyle} ref={messageBoxRef}>
      {logs.map((log, idx) => {
        return (
          <div css={style.ChatLogStyle} key={idx}>
            <p>&#91;{log.sendTime.toTimeString().split(" ")[0]}&#93;</p>
            <p>
              {log.sender} : {log.message}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatLog;
