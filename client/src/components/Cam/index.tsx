/** @jsxImportSource @emotion/react */
import { camWrapperStyle, profileStyle } from "./styles";

export interface VideoRecordProps {
  isVideoOn: boolean;
  isAudioOn: boolean;
  profile: string;
}

export interface ProfileProps {
  profile: string;
}

const Cam = ({ isVideoOn, isAudioOn, profile }: VideoRecordProps) => {
  return (
    <div css={camWrapperStyle}>
      <video autoPlay playsInline></video>
      {!isVideoOn && <Profile profile={profile} />}
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
