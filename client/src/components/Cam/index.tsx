/** @jsxImportSource @emotion/react */
import { camContainerStyle, camWrapperStyle, profileStyle } from "./styles";

export interface CamProps {
  isVideoOn: boolean;
  isAudioOn: boolean;
  profile: string;
  nickname?: string;
  scoreRank?: string;
}

export interface ProfileProps {
  profile: string;
}

const Cam = ({ isVideoOn, isAudioOn, profile, nickname, scoreRank }: CamProps) => {
  return (
    <div css={camContainerStyle}>
      <div css={camWrapperStyle}>
        <video autoPlay playsInline></video>
        {!isVideoOn && <Profile profile={profile} />}
      </div>
      <span>{nickname}</span>
      <span>{scoreRank}</span>
    </div>
  );
};

const Profile = ({ profile }: ProfileProps) => {
  return (
    <div css={profileStyle}>
      <img src={profile} />
    </div>
  );
};

export default Cam;
