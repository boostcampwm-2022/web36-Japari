/** @jsxImportSource @emotion/react */
import * as style from "./styles";

import NickNameSetting from "./NickNameSetting";
import RoomSetting from "./RoomSetting";
import FriendRequest from "./FriendRequest";
import GameInvitation from "./GameInvitation";
import PasswordSetting from "./PasswordSetting";
import { User } from "@dto";

export interface ModalProps {
  ModalType: "닉네임 설정" | "방 설정" | "비밀번호 입력" | "친구 요청" | "게임 초대";
  user?: User;
  gameId?: number;
  roomName?: string;
}

const Modal = ({ ModalType, user, gameId, roomName }: ModalProps) => {
  let modalTitle = "";
  let content = null;

  switch (ModalType) {
    case "닉네임 설정":
      modalTitle = "닉네임 설정";
      content = <NickNameSetting />;
      break;
    case "방 설정":
      modalTitle = "방 설정";
      content = <RoomSetting />;
      break;
    case "비밀번호 입력":
      modalTitle = "비밀번호 입력";
      content = <PasswordSetting />;
      break;
    case "친구 요청":
      modalTitle = "친구 요청";
      content = <FriendRequest user={user!} />;
      break;
    case "게임 초대":
      modalTitle = "게임 초대";
      content = <GameInvitation user={user!} gameId={gameId!} roomName={roomName!} />;
      break;
  }

  return (
    <div css={style.dimmed}>
      <div css={style.modalWrapper}>
        <article css={style.modalCard}>
          <p css={style.modalTitle}>{modalTitle}</p>
          {content}
        </article>
      </div>
    </div>
  );
};

export default Modal;
