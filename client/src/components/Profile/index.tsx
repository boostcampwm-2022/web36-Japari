/** @jsxImportSource @emotion/react */
import * as style from "./styles";
import ProfileContent from "./ProfileContent";
import { Oval } from "react-loader-spinner";
import { User } from "@dto";

export interface ProfileProps {
  user: User | null;
}

const Profile = ({ user }: ProfileProps) => {
  return (
    <div css={style.ProfileContainerStyle}>
      {user ? (
        <ProfileContent user={user} editable={true} />
      ) : (
        <Oval
          height={80}
          width={80}
          color="#bbbbbb"
          ariaLabel="oval-loading"
          secondaryColor="transparent"
          strokeWidth={4}
          strokeWidthSecondary={4}
        />
      )}
    </div>
  );
};

export default Profile;
