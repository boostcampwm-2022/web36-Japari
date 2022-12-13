/** @jsxImportSource @emotion/react */
import Cam, { CamProps } from "../Cam";
import * as style from "./styles";
import { User } from "@dto";
import { StreamInfo } from "../../hooks/useCams";
import Audio from "../Audio";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";

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

  return (
    <div css={style.inGameCamListStyle}>
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
  );
};

export default InGameCamList;
