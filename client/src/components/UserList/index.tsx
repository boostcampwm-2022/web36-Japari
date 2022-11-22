/** @jsxImportSource @emotion/react */

import { useState } from "react";
import UserListTab from "./UserListTab";
import UserTable from "./UserTable";

export type User = {
  userId: number;
  email: string;
  nickname: string;
  score: number;
  profileImage: string;
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
    <div>
      <UserListTab selected={selected} setSelected={setSelected} />
      <UserTable users={userMap.users} selected={selected} />
    </div>
  );
};

export default UserList;
