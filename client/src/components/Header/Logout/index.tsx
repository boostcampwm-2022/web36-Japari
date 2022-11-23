/** @jsxImportSource @emotion/react */
import logoutIcon from "../../../assets/icons/logout-icon.svg";

import * as style from "./styles";

const RoomRecord = () => {
  return (
    <div css={style.logoutContainerStyle}>
      <img src={logoutIcon} alt="logoutIcon" />
      <span css={style.logoutTextStyle}>로그아웃</span>
    </div>
  );
};

export default RoomRecord;
