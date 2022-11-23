/** @jsxImportSource @emotion/react */
import { User } from "@dto";
import Button from "../../Button";
import ProfileContent from "../../Profile/ProfileContent";
import * as style from "./styles";

interface FriendRequestProps {
  user: User;
}

const FriendRequest = ({ user }: FriendRequestProps) => {
  return (
    <div css={style.cardStyle}>
      <div>
        <ProfileContent user={user} editable={false} />
      </div>

      <div css={style.footerStyle}>
        <Button buttonType="수락" handleClick={() => {}} />
        <Button buttonType="거절" handleClick={() => {}} />
      </div>
    </div>
  );
};

export default FriendRequest;
