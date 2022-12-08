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
    <>
      <div css={style.TableRankContainerStyle}>
        {selected === 2 &&
          Array.from(Array(10).keys()).map((_, idx) => {
            return (
              <div key={idx} css={style.TableRankStyle}>
                <p css={style.TableRankNumberStyle}>{idx + 1}</p>
              </div>
            );
          })}
      </div>
      <ul css={style.TableStyle}>
        {users.map((user, key) => {
          return <UserRecord key={key} user={user} />;
        })}
      </ul>
    </>
  );
};

export default UserTable;
