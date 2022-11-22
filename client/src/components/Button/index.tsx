/** @jsxImportSource @emotion/react */
import * as style from "./styles";

export interface ButtonProps {
  buttonType: "방 만들기" | "방 나가기" | "게임 시작" | "확인" | "수락" | "닫기" | "거절";
  handleClick: () => void;
}

const Button = ({ buttonType, handleClick }: ButtonProps) => {
  let buttonStyle = null;

  switch (buttonType) {
    case "게임 시작":
      buttonStyle = [style.largeButtonStyle, style.gameStartButtonStyle];
      break;
    case "방 만들기":
      buttonStyle = [style.largeButtonStyle, style.createRoomButtonStyle];
      break;
    case "방 나가기":
      buttonStyle = [style.largeButtonStyle, style.exitRoomButtonStyle];
      break;
    case "수락":
      buttonStyle = [style.smallButtonStyle, style.acceptButtonStyle];
      break;
    case "거절":
      buttonStyle = [style.smallButtonStyle, style.declineButtonStyle];
      break;
    case "확인":
      buttonStyle = [style.smallButtonStyle, style.OKButtonStyle];
      break;
    case "닫기":
      buttonStyle = [style.smallButtonStyle, style.closeButtonStyle];
      break;
  }

  return (
    <button type="button" css={buttonStyle} onClick={handleClick}>
      {buttonType}
    </button>
  );
};

export default Button;
