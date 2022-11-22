/** @jsxImportSource @emotion/react */
import * as style from "./styles";

import NickNameSetting from "./NickNameSetting";
import RoomSetting from "./RoomSetting";
import FriendRequest from "./FriendRequest";
import GameInvitation from "./GameInvitation";
import PasswordSetting from "./PasswordSetting";

export interface ModalProps {
  ModalType: "닉네임 설정" | "방 설정" | "비밀번호 입력" | "친구 요청" | "게임 초대";
  nickname?: string;
  email?: string;
  score?: number;
  rank?: number;
}

const Modal = ({ ModalType, nickname, email, score, rank }: ModalProps) => {
  let content = null;

  switch (ModalType) {
    case "닉네임 설정":
      content = <NickNameSetting />;
      break;
    case "방 설정":
      content = <RoomSetting />;
      break;
    case "비밀번호 입력":
      content = <PasswordSetting />;
      break;
    case "친구 요청":
      content = <FriendRequest nickname={nickname!} email={email!} score={score!} rank={rank!} />;
      break;
    case "게임 초대":
      content = <GameInvitation nickname={nickname!} gameId={1} roomName="초보만 오셈" />;
      break;
  }

  return (
    <div css={style.dimmed}>
      <div css={style.modalWrapper}>
        <article css={style.modalCard}>
          <p css={style.modalTitle}>{ModalType}</p>
          {content}
        </article>
      </div>
    </div>
  );
};

export default Modal;
