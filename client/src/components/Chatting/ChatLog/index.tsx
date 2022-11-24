/** @jsxImportSource @emotion/react */
import { Chat } from "..";
import * as style from "./styles";

export interface ChatLogProps {
  logs: Chat[];
}

const ChatLog = ({ logs }: ChatLogProps) => {
  return (
    <div css={style.ChatLogContainerStyle}>
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
