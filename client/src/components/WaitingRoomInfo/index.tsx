/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import Button from "../Button";
import Cam, { CamProps } from "../Cam";
import Camtest from "../Camtest";
import { Room } from "../RoomList";
import RoomRecord from "../RoomList/RoomRecord";
import * as style from "./styles";

export interface WaitingRoomInfoProps {
  roomRecord: Room;
}

export interface ProfileProps {
  profile: string;
}

const WaitingRoomInfo = ({ roomRecord }: WaitingRoomInfoProps) => {
  const socket = useRecoilValue(socketState);
  // [camList, setCamList] = useState<Cam[]>([]);
  const navigate = useNavigate();

  const handleRootOutButton = () => {
    navigate("/lobby");
  };

  const handleGameStartButton = () => {
    // socket.emit('start_game', {gameRoomId: roomRecord.gameRoomId})

    navigate(`/playing/${roomRecord.roomId}`);
    // socket.on('start_game') 시 naviagte가 되도록 변경될 여지 있음
  };

  return (
    <div css={style.waitingRoomInfoStyle}>
      <div css={style.headerStyle}>
        <RoomRecord {...roomRecord} />
      </div>
      <div css={style.mainWrapperStyle}>
        {/* <div css={style.camListContainerStyle}>
          {camList.map((cam, idx) => (
            <Cam key={idx} {...cam} />
          ))}
        </div> */}
        <Camtest />
        <div css={style.footerStyle}>
          <Button buttonType="방 나가기" handleClick={handleRootOutButton} />
          <Button buttonType="게임 시작" handleClick={handleGameStartButton} />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomInfo;
