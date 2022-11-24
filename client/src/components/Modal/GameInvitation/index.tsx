/** @jsxImportSource @emotion/react */

import { User } from "@dto";
import Button from "../../Button";
import ProfileContent from "../../Profile/ProfileContent";
import * as style from "./styles";

interface GameInvitationProps {
  user: User;
  gameId: number;
  roomName: string;
}

const GameInvitation = ({ user, gameId, roomName }: GameInvitationProps) => {
  return (
    <>
      {/* <ProfileContent user={user} /> */}
      <div css={style.modalContents}>
        <ul css={style.modalContentLeftStyle}>
          <li>초대한 유저</li>
          <li>게임 종류</li>
          <li>방 이름</li>
        </ul>
        <ul css={style.modalContentRightStyle}>
          <li>{user.nickname}</li>
          <li>캐치마인드</li>
          <li>{roomName}</li>
        </ul>
      </div>

      <div css={style.footerStyle}>
        <Button buttonType="수락" handleClick={() => {}} />
        <Button buttonType="거절" handleClick={() => {}} />
      </div>
    </>
  );
};

export default GameInvitation;
