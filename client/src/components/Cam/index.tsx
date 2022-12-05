/** @jsxImportSource @emotion/react */
import * as style from "./styles";

export interface CamProps {
  videoRef?: React.LegacyRef<HTMLVideoElement>;
  isVideoOn: boolean;
  isAudioOn: boolean;
  profile: string;
  nickname?: string;
  scoreRank?: string;
}

export interface ProfileProps {
  profile: string;
}

const Cam = ({ videoRef, isVideoOn, isAudioOn, profile, nickname, scoreRank }: CamProps) => {
  return (
    <div css={style.camContainerStyle}>
      <div css={style.camWrapperStyle}>
        <video ref={videoRef} autoPlay playsInline></video>
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
