/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import Button from "../Button";
import Audio from "../Audio";
import Cam, { CamProps } from "../Cam";
import { Room } from "../RoomList";
import RoomRecord from "../RoomList/RoomRecord";
import * as style from "./styles";
import { User } from "@dto";
import { useCams } from "../../hooks/useCams";
import { userState } from "../../store/user";

export interface WaitingRoomInfoProps {
  roomRecord: Room;
  participants: User[];
}

export interface ProfileProps {
  profile: string;
}

const WaitingRoomInfo = ({ roomRecord, participants }: WaitingRoomInfoProps) => {
  const socket = useRecoilValue(socketState);
  const user = useRecoilValue(userState);
  // [camList, setCamList] = useState<Cam[]>([]);
  const navigate = useNavigate();
  const { videoStream, audioStream } = useCams();

  const handleRootOutButton = () => {
    navigate("/lobby");
    socket.emit("game-room/exit");
  };

  const handleGameStartButton = () => {
    // socket.emit('start_game', {gameRoomId: roomRecord.gameRoomId})

    navigate(`/playing/${roomRecord.roomId}`, { state: { gameId: roomRecord.gameId } });
    // socket.on('start_game') 시 naviagte가 되도록 변경될 여지 있음
  };

  useEffect(() => {
    socket.on("play/start", () => {
      navigate(`/playing/${roomRecord.roomId}`, { state: { gameId: roomRecord.gameId } });
    });
  }, [socket]);

  return (
    <div css={style.waitingRoomInfoStyle}>
      <div css={style.headerStyle}>
        <RoomRecord {...roomRecord} />
      </div>
      <div css={style.mainWrapperStyle}>
        <div css={style.camListContainerStyle}>
          {participants.map(participant => {
            const videoStreamInfo = videoStream.get(participant.email);
            const audioStreamInfo = audioStream.get(participant.email);

            return (
              <div key={participant.userId}>
                {videoStreamInfo ? (
                  <Cam
                    mediaStream={videoStreamInfo.mediaStream ?? null}
                    isVideoOn={true}
                    userInfo={videoStreamInfo.userInfo}
                  />
                ) : (
                  <Cam mediaStream={null} isVideoOn={false} userInfo={participant} />
                )}
                {audioStreamInfo && user?.userId !== audioStreamInfo.userInfo.userId && (
                  <Audio mediaStream={audioStreamInfo.mediaStream ?? null} />
                )}
              </div>
            );
          })}
        </div>
        <div css={style.footerStyle}>
          <Button buttonType="방 나가기" handleClick={handleRootOutButton} />
          <Button buttonType="게임 시작" handleClick={handleGameStartButton} />
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomInfo;
