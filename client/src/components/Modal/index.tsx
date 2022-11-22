/** @jsxImportSource @emotion/react */
import * as style from "./styles";

import NickNameSetting from "./Contents/NickNameSetting";
import RoomSetting from "./Contents/RoomSetting";

export interface ModalProps {
  ModalType: "닉네임 설정" | "방 설정" | "비밀번호 입력" | "친구 요청" | "게임 초대";
}

const Modal = ({ ModalType }: ModalProps) => {
  let content = null;

  switch (ModalType) {
    case "닉네임 설정":
      content = <NickNameSetting />;
      break;
    case "방 설정":
      content = <RoomSetting />;
      break;
    case "비밀번호 입력":
      break;
    // case "친구 요청":
    //   content = <RequestFrie />;
    //   break;
    case "게임 초대":
      break;
  }

  return (
    <div css={style.modalWrapper}>
      <article css={style.modalCard}>
        <p css={style.modalTitle}>{ModalType}</p>
        {content}
      </article>
    </div>
  );
};

export default Modal;
