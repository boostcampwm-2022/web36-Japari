/** @jsxImportSource @emotion/react */
import Button from "../Button";
import Cam, { CamProps } from "../Cam";
import RoomRecord, { RoomRecordProps } from "../RoomList/RoomRecord";
import * as style from "./styles";

export interface WaitingRoomInfoProps {
  roomRecord: RoomRecordProps;
  camList: CamProps[];
}

export interface ProfileProps {
  profile: string;
}

const WaitingRoomInfo = ({ roomRecord, camList }: WaitingRoomInfoProps) => {
  // [camList, setCamList] = useState<Cam[]>([]);

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
          <Button buttonType="방 나가기" handleClick={() => {}} />
          <Button buttonType="게임 시작" handleClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomInfo;
