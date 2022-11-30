/** @jsxImportSource @emotion/react */
import DefaultUserImage from "../../../../assets/images/default-user-image.png";
import { User } from "../..";
import * as style from "./styles";
import { css } from "@emotion/react";

export interface UserRecordProps {
  user: User;
}

const UserRecord = ({ user }: UserRecordProps) => {
  return (
    <li css={style.UserRecordContainerStyle}>
      <div css={style.ImageAndConnectionStyle}>
        <div css={style.ImageDivStyle}>
          <img
            css={style.ImageStyle}
            src={user.profileImage === "" ? DefaultUserImage : user.profileImage}
            alt="profileImage"
          />
          <div
            css={css`
              ${style.ConnectionCircleStyle}
              ${user.connected ? style.OnCircleStyle : style.OffCircleStyle}
            `}
          />
        </div>
      </div>
      <p css={style.UserNicknameStyle}>{user.nickname}</p>
      <p css={style.UserScoreStyle}>{user.score} 점</p>
    </li>
  );
};

export default UserRecord;
