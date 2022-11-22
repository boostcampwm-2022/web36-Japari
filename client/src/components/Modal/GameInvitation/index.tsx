/** @jsxImportSource @emotion/react */

import Button from "../../Button";
import { footerStyle } from "./styles";

interface GameInvitationProps {
  nickname: string;
  gameId: number;
  roomName: string;
}

const GameInvitation = ({ nickname, gameId, roomName }: GameInvitationProps) => {
  return (
    <>
      <div>게임 초대 관련 정보</div>

      <div css={footerStyle}>
        <Button buttonType="수락" handleClick={() => {}} />
        <Button buttonType="거절" handleClick={() => {}} />
      </div>
    </>
  );
};

export default GameInvitation;
