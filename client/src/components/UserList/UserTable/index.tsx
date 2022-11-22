/** @jsxImportSource @emotion/react */

import { User } from "..";
import UserRecord from "./UserRecord";

export interface UserTableProps {
  users: User[];
  selected: number;
}

const UserTable = ({ users, selected }: UserTableProps) => {
  return (
    <ul>
      {users.map(user => {
        return <UserRecord user={user} />;
      })}
    </ul>
  );
};

export default UserTable;
