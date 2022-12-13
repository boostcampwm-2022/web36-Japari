/** @jsxImportSource @emotion/react */
import Cam, { CamProps } from "../Cam";
import * as style from "./styles";
import { User } from "@dto";
import { StreamInfo } from "../../hooks/useCams";
import Audio from "../Audio";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import micOn from "../../assets/icons/mic-on.svg";
import micOff from "../../assets/icons/mic-off.svg";

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
        console.log(audioStreamInfo);
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
            {/* audioStreaminfo에서 getAudioTracks에서 enabled 되있는지? */}
            {/* {audioStreamInfo && audioStreamInfo.getAudioTracks} */}
            {/* <img src={micOff} alt="mike" /> */}
          </div>
        );
      })}
    </div>
  );
};

export default InGameCamList;
