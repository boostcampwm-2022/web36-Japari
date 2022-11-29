/** @jsxImportSource @emotion/react */
import logoutIcon from "../../../assets/icons/logout-icon.svg";
import { useRecoilValue } from "recoil";
import { socketState } from "../../../store/socket";
import { logout } from "../../../api/auth";
import * as style from "./styles";
import { useNavigate } from "react-router-dom";
const RoomRecord = () => {
  const navigate = useNavigate();
  const socket = useRecoilValue(socketState);

  const handleLogout = () => {
    socket.disconnect();
    logout().then(() => {
      navigate("/");
    });
  };

  return (
    <div css={style.logoutContainerStyle} onClick={handleLogout}>
      <img src={logoutIcon} alt="logoutIcon" />
      <span css={style.logoutTextStyle}>로그아웃</span>
    </div>
  );
};

export default RoomRecord;
