/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import * as style from "./styles";

export interface CamProps {
  // videoRef?: React.LegacyRef<HTMLVideoElement>;
  mediaStream: MediaStream | null;
  isVideoOn: boolean;
  isAudioOn: boolean;
  profile: string;
  nickname?: string;
  scoreRank?: string;
}

export interface ProfileProps {
  profile: string;
}

const Cam = ({ mediaStream, isVideoOn, isAudioOn, profile, nickname, scoreRank }: CamProps) => {
  const user = useRecoilValue(userState);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return (
    <div css={style.camContainerStyle}>
      <div css={style.camWrapperStyle}>
        <video ref={videoRef} autoPlay playsInline muted></video>
        {!isVideoOn && <Profile profile={profile} />}
      </div>
      <span css={style.camNickNameStyle}>{nickname}</span>
      <span css={style.camScoreStyle}>{scoreRank}</span>
    </div>
  );
};

const Profile = ({ profile }: ProfileProps) => {
  return (
    <div css={style.profileStyle}>
      <img src={profile} />
    </div>
  );
};

export default Cam;
