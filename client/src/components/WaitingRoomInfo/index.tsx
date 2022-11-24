/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import Cam, { CamProps } from "../Cam";
import { Room } from "../RoomList";
import RoomRecord from "../RoomList/RoomRecord";
import * as style from "./styles";

export interface WaitingRoomInfoProps {
  roomRecord: Room;
  camList: CamProps[];
}

export interface ProfileProps {
  profile: string;
}

const WaitingRoomInfo = ({ roomRecord, camList }: WaitingRoomInfoProps) => {
  // [camList, setCamList] = useState<Cam[]>([]);
  const navigate = useNavigate();

  const handleRootOutButton = () => {
    navigate("/lobby");
  };

  return (
    <div css={style.waitingRoomInfoStyle}>
      <div css={style.headerStyle}>
        <RoomRecord {...roomRecord} />
      </div>
      <div css={style.mainWrapperStyle}>
        <div css={style.camListContainerStyle}>
          {camList.map(cam => (
            <Cam {...cam} />
          ))}
        </div>
        <div css={style.footerStyle}>
          <Button buttonType="방 나가기" handleClick={handleRootOutButton} />
          <Button buttonType="게임 시작" handleClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomInfo;
