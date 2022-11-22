/** @jsxImportSource @emotion/react */
import Input from "../../Input";
import Button from "../../Button";
import Select from "../../Select";
import * as style from "./styles";

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
            <Select selectType="게임 생성" width="13rem" />
          </li>
          <li>
            <Input type="text" placeholder="방 이름을 입력해 주세요." width="13rem" />
          </li>
          <li>
            <Select selectType="공개방 설정" width="13rem" />
          </li>
          <li>
            <Input type="password" placeholder="비밀번호를 입력해 주세요." width="13rem" />
          </li>
          <li>
            <Select selectType="인원 제한" width="13rem" />
          </li>
        </ul>
      </aside>
      <div css={style.footerStyle}>
        <Button buttonType="확인" handleClick={() => {}} />
        <Button buttonType="닫기" handleClick={() => {}} />
      </div>
    </>
  );
};

export default RoomSetting;
