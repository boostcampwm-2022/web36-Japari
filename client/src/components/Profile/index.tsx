/** @jsxImportSource @emotion/react */
import * as style from "./styles";
import ProfileContent from "./ProfileContent";
import { Oval } from "react-loader-spinner";
import { User } from "@dto";
import Spinner from "../Loader/Spinner";

export interface ProfileProps {
  user: User | null;
  setNicknameChangeModalOpen?: any;
}

const Profile = ({ user, setNicknameChangeModalOpen }: ProfileProps) => {
  return (
    <div css={style.ProfileContainerStyle}>
      {user ? (
        <ProfileContent user={user} editable={true} setNicknameChangeModalOpen={setNicknameChangeModalOpen} />
      ) : (
        <Spinner color="#bbbbbb" trackColor="transparent" />
      )}
    </div>
  );
};

export default Profile;
