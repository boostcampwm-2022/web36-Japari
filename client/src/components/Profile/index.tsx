/** @jsxImportSource @emotion/react */
import * as style from "./styles";
import ProfileContent from "./ProfileContent";

type User = {
  userId: number;
  email: string;
  nickname: string;
  score: number;
  profileImage: string;
};

export interface ProfileProps {
  user: User;
}

const Profile = ({ user }: ProfileProps) => {
  return (
    <div css={style.ProfileContainerStyle}>
      <ProfileContent user={user} />
    </div>
  );
};

export default Profile;
