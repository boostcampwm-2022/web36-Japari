/** @jsxImportSource @emotion/react */
import { useState } from "react";
import UserListTab from "./UserListTab";
import UserTable from "./UserTable";
import * as style from "./styles";

export type User = {
  userId: number;
  email: string;
  nickname: string;
  score: number;
  profileImage: string;
  connected: boolean;
};

export interface UserListProps {
  userMap: {
    users: User[];
    friends: User[];
    rank: User[];
  };
}

const UserList = ({ userMap }: UserListProps) => {
  const [selected, setSelected] = useState<number>(0);

  return (
    <div css={style.ListContainerStyle}>
      <UserListTab selected={selected} setSelected={setSelected} />
      {selected == 0 && <UserTable users={userMap.users} selected={selected} />}
      {selected == 1 && <UserTable users={userMap.friends} selected={selected} />}
      {selected == 2 && <UserTable users={userMap.rank} selected={selected} />}
    </div>
  );
};

export default UserList;
