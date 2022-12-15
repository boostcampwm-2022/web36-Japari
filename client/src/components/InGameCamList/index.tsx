/** @jsxImportSource @emotion/react */
import Cam from "../Cam";
import * as style from "./styles";
import { User } from "@dto";
import { StreamInfo } from "../../hooks/useCams";
import Audio from "../Audio";
import { useRecoilValue, useRecoilState } from "recoil";
import { userState } from "../../store/user";
import { useEffect, useCallback, useState } from "react";
import { audioState } from "../../store/media";

import micOn from "../../assets/icons/mic-on.svg";
import micOff from "../../assets/icons/mic-off.svg";
import { socketState } from "../../store/socket";

export interface InGameCamListProps {
  participants: User[];
  videoStream: Map<string, StreamInfo>;
  audioStream: Map<string, StreamInfo>;
}

export interface ProfileProps {
  profile: string;
}

const InGameCamList = ({ participants, videoStream, audioStream }: InGameCamListProps) => {
  const user = useRecoilValue(userState);
  const socket = useRecoilValue(socketState);
  const [remoteVideoOnOff, setRemoteVideoOnOff] = useState<Map<number, boolean>>(new Map());
  const [remoteAudioOnOff, setRemoteAudioOnOff] = useState<Map<number, boolean>>(new Map());
  const [audio] = useRecoilState(audioState);

  const initializeMediaStatus = useCallback((participant: User, videoStreamInfo: StreamInfo | undefined) => {
    if (videoStreamInfo) {
      setRemoteVideoOnOff(current => {
        const newMap = new Map(current);
        newMap.set(participant.userId, videoStreamInfo.mediaStream.getVideoTracks()[0].enabled);
        return newMap;
      });
    }
  }, []);

  useEffect(() => {
    participants.forEach(participant => {
      const videoStreamInfo = videoStream.get(participant.email);
      initializeMediaStatus(participant, videoStreamInfo);
    });
  }, [videoStream, initializeMediaStatus, participants]);

  useEffect(() => {
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
      socket.off("audio-status/modify");
      socket.off("video-status/modify");
    };
  }, [socket]);

  useEffect(() => {
    if (audioStream.size > 0 && videoStream.size > 0) {
      socket.emit("audio-status/modify", audio);
    }
  }, [audio, socket, audioStream, videoStream]);

  return (
    <div css={style.inGameCamListStyle}>
      {participants.map(participant => {
        const videoStreamInfo = videoStream.get(participant.email);
        const audioStreamInfo = audioStream.get(participant.email);
        return (
          <div css={style.camBoxStyle} key={participant.userId}>
            {videoStreamInfo ? (
              <Cam
                mediaStream={videoStreamInfo.mediaStream ?? null}
                isVideoOn={remoteVideoOnOff.get(participant.userId)}
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
  );
};

export default InGameCamList;
