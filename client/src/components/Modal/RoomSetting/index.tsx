/** @jsxImportSource @emotion/react */
import Input from "../../Input";
import Button from "../../Button";
import Select from "../../Select";
import * as style from "./styles";
import { useEffect, useState } from "react";

interface RoomSettingProps {
  closeModal: () => void;
}

const RoomSetting = ({ closeModal }: RoomSettingProps) => {
  const [gameId, setGameId] = useState<number>(-1);
  const [title, setTitle] = useState<string>("");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [maximumPeople, setMaximumPeople] = useState<number>(-1);
  const createRoom = () => {
    // room 생성 혹은 설정 로직
    const data = { gameId, title, private: isPrivate, maximumPeople, password };
    // socket.emit('create_game', data)
    // console.log(data);
    closeModal();
  };

  return (
    <>
      <aside css={style.modalContents}>
        <ul css={style.modalContentLeftStyle}>
          <li>
            <span>게임 종류</span>
          </li>
          <li>
            <span>방 이름</span>
          </li>
          <li>
            <span>공개방 설정</span>
          </li>
          <li>
            <span>비밀 번호</span>
          </li>
          <li>
            <span>최대 인원 제한</span>
          </li>
        </ul>
        <ul>
          <li>
            <Select selectType="게임 생성" width="13rem" setValue={setGameId} />
          </li>
          <li>
            <Input type="text" placeholder="방 이름을 입력해 주세요." width="13rem" setValue={setTitle} />
          </li>
          <li>
            <Select selectType="공개방 설정" width="13rem" setValue={setIsPrivate} />
          </li>
          <li>
            <Input
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              width="13rem"
              disabled={!isPrivate}
              setValue={setPassword}
            />
          </li>
          <li>
            <Select selectType="인원 제한" width="13rem" setValue={setMaximumPeople} />
          </li>
        </ul>
      </aside>
      <div css={style.footerStyle}>
        <Button buttonType="확인" handleClick={createRoom} />
        <Button buttonType="닫기" handleClick={closeModal} />
      </div>
    </>
  );
};

export default RoomSetting;
