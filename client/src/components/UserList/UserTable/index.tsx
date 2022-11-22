/** @jsxImportSource @emotion/react */

import { User } from "..";
import * as style from "./styles";
import UserRecord from "./UserRecord";

export interface UserTableProps {
  users: User[];
  selected: number;
}

const UserTable = ({ users, selected }: UserTableProps) => {
  return (
    <ul css={style.TableContainerStyle}>
      {users.map((user, key) => {
        return <UserRecord key={key} user={user} />;
      })}
    </ul>
  );
};

export default UserTable;
