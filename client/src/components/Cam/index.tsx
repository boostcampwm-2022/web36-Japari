/** @jsxImportSource @emotion/react */
import { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import { User } from "@dto";
import * as style from "./styles";

export interface CamProps {
  mediaStream: MediaStream | null;
  isVideoOn: boolean;
  userInfo: User;
}

export interface ProfileProps {
  profile: string;
}

const Cam = ({ mediaStream, isVideoOn, userInfo }: CamProps) => {
  const user = useRecoilValue(userState);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return (
    <div css={style.camContainerStyle}>
      <div css={style.camWrapperStyle}>
        <video ref={videoRef} autoPlay playsInline muted={user?.userId === userInfo.userId}></video>
        {!isVideoOn && <Profile profile={userInfo.profileImage} />}
      </div>
      <span css={style.camNickNameStyle}>{userInfo.nickname}</span>
      <span css={style.camScoreStyle}>{userInfo.score}</span>
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
