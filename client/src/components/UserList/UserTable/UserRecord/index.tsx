/** @jsxImportSource @emotion/react */

import { User } from "../..";

export interface UserRecordProps {
  user: User;
}

const UserRecord = ({ user }: UserRecordProps) => {
  return (
    <li>
      <p>{user.nickname}</p>
      <p>{user.score}</p>
    </li>
  );
};

export default UserRecord;
