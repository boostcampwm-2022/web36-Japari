/** @jsxImportSource @emotion/react */

import Input from "../../Input";
import Button from "../../Button";
import Select from "../../Select";
import CheckBox from "../../CheckBox";
import * as style from "../styles";

const RoomSetting = () => {
  return (
    <>
      <aside css={style.modalContents}>
        <ul>
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
            <Select SelectType="게임 생성" />
          </li>
          <li>
            <Input placeholder="" />
          </li>
          <li>
            <Select SelectType="공개방 설정" />
          </li>
          <li>
            <Input placeholder="비밀번호를 입력해 주세요." />
          </li>
          <li>
            <Select SelectType="인원 제한" />
          </li>
        </ul>
      </aside>
      <Button buttonType="확인" handleClick={() => {}} />
    </>
  );
};

export default RoomSetting;
