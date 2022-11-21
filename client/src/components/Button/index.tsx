/** @jsxImportSource @emotion/react */

import {
  largeButtonStyle,
  smallButtonStyle,
  gameStartButtonStyle,
  createRoomButtonStyle,
  exitRoomButtonStyle,
  acceptButtonStyle,
  declineButtonStyle,
  OKButtonStyle,
  closeButtonStyle,
} from "./styles";

export interface ButtonProps {
  buttonType: "방 만들기" | "방 나가기" | "게임 시작" | "확인" | "수락" | "닫기" | "거절";
  handleClick: () => void;
}

const Button = ({ buttonType, handleClick }: ButtonProps) => {
  let style = null;

  switch (buttonType) {
    case "게임 시작":
      style = [largeButtonStyle, gameStartButtonStyle];
      break;
    case "방 만들기":
      style = [largeButtonStyle, createRoomButtonStyle];
      break;
    case "방 나가기":
      style = [largeButtonStyle, exitRoomButtonStyle];
      break;
    case "수락":
      style = [smallButtonStyle, acceptButtonStyle];
      break;
    case "거절":
      style = [smallButtonStyle, declineButtonStyle];
      break;
    case "확인":
      style = [smallButtonStyle, OKButtonStyle];
      break;
    case "닫기":
      style = [smallButtonStyle, closeButtonStyle];
      break;
  }

  return (
    <button type="button" css={style} onClick={handleClick}>
      {buttonType}
    </button>
  );
};

export default Button;
