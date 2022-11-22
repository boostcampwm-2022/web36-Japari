/** @jsxImportSource @emotion/react */

import Button from "../../Button";
import { footerStyle } from "./styles";

interface FriendRequestProps {
  nickname: string;
  email: string;
  score: number;
  rank: number;
}

const FriendRequest = ({ nickname, score, rank, email }: FriendRequestProps) => {
  return (
    <>
      <div>Profile Content 컴포넌트</div>

      <div css={footerStyle}>
        <Button buttonType="수락" handleClick={() => {}} />
        <Button buttonType="거절" handleClick={() => {}} />
      </div>
    </>
  );
};

export default FriendRequest;
