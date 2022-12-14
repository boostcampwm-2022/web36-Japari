/** @jsxImportSource @emotion/react */
import logoutIcon from "../../../assets/icons/logout-icon.svg";
import { useRecoilState, useRecoilValue } from "recoil";
import { socketState } from "../../../store/socket";
import { logout } from "../../../api/auth";
import * as style from "./styles";
import { useNavigate } from "react-router-dom";
import { userState } from "../../../store/user";
const RoomRecord = () => {
  const navigate = useNavigate();
  const socket = useRecoilValue(socketState);
  const [, setUser] = useRecoilState(userState);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    socket.disconnect();
    navigate("/");
  };

  return (
    <div css={style.logoutContainerStyle} onClick={handleLogout}>
      <img css={style.logoutIconStyle} src={logoutIcon} alt="logoutIcon" />
      <span css={style.logoutTextStyle}>로그아웃</span>
    </div>
  );
};

export default RoomRecord;
