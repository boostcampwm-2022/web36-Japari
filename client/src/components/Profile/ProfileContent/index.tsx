/** @jsxImportSource @emotion/react */
import * as style from "./styles";
import DefaultUserImage from "../../../assets/images/default-user-image.png";
import EditIcon from "../../../assets/icons/edit-icon.svg";
import { User } from "@dto";

export interface ProfileProps {
  user: User;
  editable?: boolean;
}

const ProfileContent = ({ user, editable }: ProfileProps) => {
  return (
    <div css={style.ProfileContentStyle}>
      <div css={style.ImageDivStyle}>
        <img
          css={style.ImageStyle}
          src={user.profileImage === "" ? DefaultUserImage : user.profileImage}
          alt="profile"
        />
      </div>
      <div css={style.ProfileInfoStyle}>
        <div css={style.ProfileNicknameContainerStyle}>
          <p css={style.ProfileNicknameStyle}>{user.nickname}</p>
          {editable && <img css={style.ProfileEditIconStyle} src={EditIcon} alt="edit-icon" />}
        </div>
        <p css={style.ProfileEmailStyle}>{user.email}</p>
        <p css={style.ProfileScoreStyle}>
          {user.score} 점 ( {user.rank} 위 )
        </p>
      </div>
    </div>
  );
};

export default ProfileContent;
