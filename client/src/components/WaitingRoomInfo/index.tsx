/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import Button from "../Button";
import Audio from "../Audio";
import Cam from "../Cam";
import { Room } from "../RoomList";
import RoomRecord from "../RoomList/RoomRecord";
import * as style from "./styles";
import { User } from "@dto";
import { useCams, StreamInfo } from "../../hooks/useCams";
import { userState } from "../../store/user";
import Modal from "../Modal";

import micOn from "../../assets/icons/mic-on.svg";
import micOff from "../../assets/icons/mic-off.svg";
import camOn from "../../assets/icons/cam-on.svg";
import camOff from "../../assets/icons/cam-off.svg";

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
  const navigate = useNavigate();
  const { videoStream, audioStream } = useCams();
  const [, setRemoteVideoOnOff] = useState<Map<number, boolean>>(new Map());
  const [remoteAudioOnOff, setRemoteAudioOnOff] = useState<Map<number, boolean>>(new Map());

  const [modifyRoomModalOpen, setModifyRoomModalOpen] = useState<boolean>(false);

  const initializeMediaStatus = (
    participant: User,
    videoStreamInfo: StreamInfo | undefined,
    audioStreamInfo: StreamInfo | undefined
  ) => {
    if (!videoStreamInfo || !audioStreamInfo) return;
    setRemoteVideoOnOff(current => {
      const newMap = new Map(current);
      newMap.set(participant.userId, videoStreamInfo.mediaStream.getVideoTracks()[0].enabled);
      return newMap;
    });

    setRemoteAudioOnOff(current => {
      const newMap = new Map(current);
      remoteAudioOnOff.set(participant.userId, audioStreamInfo.mediaStream.getAudioTracks()[0].enabled);
      return newMap;
    });
  };

  const handleRoomRecordClick = () => {
    setModifyRoomModalOpen(true);
  };

  const handleRootOutButton = () => {
    navigate("/lobby");
    socket.emit("wait-room/exit");
  };

  const handleGameStartButton = () => {
    if (roomRecord.minimumPeople > participants.length) {
      alert(`최소 인원 ${roomRecord.minimumPeople}명이 모여야 게임을 시작할 수 있습니다.`);
      return;
    }
    socket.emit("catch-mind/start");
  };

  useEffect(() => {
    socket.on("play/start", () => {
      navigate(`/playing/${roomRecord.roomId}`, { state: { gameId: roomRecord.gameId } });
    });
    return () => {
      socket.off("play/start");
    };
  }, [socket, navigate, roomRecord]);

  useEffect(() => {
    participants.forEach(participant => {
      const videoStreamInfo = videoStream.get(participant.email);
      const audioStreamInfo = audioStream.get(participant.email);
      initializeMediaStatus(participant, videoStreamInfo, audioStreamInfo);
    });
  }, []);

  useEffect(() => {
    socket.on("game-room/error", errorMessage => {
      alert(errorMessage);
    });
    socket.on("game-room/info", data => {
      setModifyRoomModalOpen(false);
    });
    socket.on("audio-status/modify", ({ userInfo, audioStatus }) => {
      setRemoteAudioOnOff(current => {
        const newMap = new Map(current);
        newMap.set(userInfo.userId, audioStatus);
        return newMap;
      });
    });
    socket.on("video-status/modify", ({ userInfo, videoStatus }) => {
      setRemoteVideoOnOff(current => {
        const newMap = new Map(current);
        newMap.set(userInfo.userId, videoStatus);
        return newMap;
      });
    });
    return () => {
      socket.off("game-room/error");
      socket.off("audio-status/modify");
      socket.off("video-status/modify");
    };
  }, [socket]);

  return (
    <div css={style.waitingRoomInfoStyle}>
      <div css={style.headerStyle}>
        <RoomRecord {...roomRecord} onClickRecord={handleRoomRecordClick} />
        {modifyRoomModalOpen && (
          <Modal ModalType="방 설정" closeModal={() => setModifyRoomModalOpen(false)} roomSettingMode="MODIFY" />
        )}
      </div>
      <div css={style.mainWrapperStyle}>
        <div css={style.camListContainerStyle}>
          {participants.map(participant => {
            const videoStreamInfo = videoStream.get(participant.email);
            const audioStreamInfo = audioStream.get(participant.email);

            return (
              <div css={style.camBoxStyle} key={participant.userId}>
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
                {participant.userId !== user?.userId &&
                  (remoteAudioOnOff.get(participant.userId) ? (
                    <img css={style.micStyle} src={micOn} alt="mic-on" />
                  ) : (
                    <img css={style.micStyle} src={micOff} alt="mic-off" />
                  ))}
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
