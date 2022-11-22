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
    <div css={style.TableContainerStyle}>
      <ul css={style.TableStyle}>
        {users.map((user, key) => {
          return <UserRecord key={key} user={user} />;
        })}
      </ul>
    </div>
  );
};

export default UserTable;
