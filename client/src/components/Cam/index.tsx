/** @jsxImportSource @emotion/react */
import React, { useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import { currentScoreState } from "../../store/catchmind";
import { User } from "@dto";
import * as style from "./styles";
import { useLocation } from "react-router-dom";

export interface CamProps {
  mediaStream: MediaStream | null;
  isVideoOn: boolean;
  userInfo: User;
}

export interface ProfileProps {
  profile: string;
}

interface ScoreProps {
  nickname: string;
  score: number;
  totalScore: number;
  userId: number;
}

const Cam = ({ mediaStream, isVideoOn, userInfo }: CamProps) => {
  const user = useRecoilValue(userState);
  const videoRef = useRef<HTMLVideoElement>(null);
  const path = useLocation().pathname.split("/")[1];
  const currentScore = useRecoilValue<any>(currentScoreState);

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
      {path === "waiting" ? (
        <span css={style.camScoreStyle}>{userInfo.score}</span>
      ) : currentScore ? (
        currentScore.scoreInfo.map((cur: ScoreProps, idx: number) => {
          if (cur.userId === userInfo.userId)
            return (
              <span css={style.camScoreStyle} key={idx}>
                {cur.totalScore}
              </span>
            );
          return <React.Fragment key={idx}></React.Fragment>;
        })
      ) : (
        <span css={style.camScoreStyle}>0</span>
      )}
    </div>
  );
};

const Profile = ({ profile }: ProfileProps) => {
  return (
    <div css={style.profileStyle}>
      <img src={profile} alt="profile" />
    </div>
  );
};

export default Cam;
