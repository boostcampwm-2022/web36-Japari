/** @jsxImportSource @emotion/react */

import Input from "../../Input";
import Button from "../../Button";

interface FriendRequestProps {
  nickname: string;
  email: string;
  score: number;
  rank: number;
}

const FriendRequest = ({ nickname, score, rank, email }: FriendRequestProps) => {
  return (
    <>
      <Input placeholder="" />
      <div>
        <span>프로필 대용</span>
        <div>
          <span>{nickname}</span>
          <span>{email}</span>
          <span>
            {score}점 ( {rank}위 ){" "}
          </span>
        </div>
      </div>

      <div>
        <Button buttonType="수락" handleClick={() => {}} />
        <Button buttonType="거절" handleClick={() => {}} />
      </div>
    </>
  );
};

export default FriendRequest;
