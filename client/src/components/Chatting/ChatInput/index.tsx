/** @jsxImportSource @emotion/react */
import Input from "../../Input";
import chatInputEnter from "../../../assets/icons/chat-input-enter.svg";
import * as style from "./styles";

const ChatInput = () => {
  return (
    <div css={style.ChatInputContainerStyle}>
      <Input placeholder="메세지 입력하기..." />
      <img src={chatInputEnter} alt="chatLogEnter" />
    </div>
  );
};

export default ChatInput;
