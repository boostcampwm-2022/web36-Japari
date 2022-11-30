/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import UserListTab from "./UserListTab";
import UserTable from "./UserTable";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import * as style from "./styles";
import * as dummy from "../../pages/dummy";

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

const UserList = () => {
  const socket = useRecoilValue(socketState);
  const [selected, setSelected] = useState<number>(0);
  const [userMap, setUserMap] = useState(dummy.dummyUserMap);

  useEffect(() => {
    socket.on("user/online", data => {
      setUserMap(current => {
        return { ...current, users: Object.values(data) };
      });
    });
    return () => {
      socket.off("user/online");
    };
  }, [socket]);

  return (
    <div css={style.ListContainerStyle}>
      <UserListTab selected={selected} setSelected={setSelected} />
      {selected === 0 && <UserTable users={userMap.users} selected={selected} />}
      {selected === 1 && <UserTable users={userMap.friends} selected={selected} />}
      {selected === 2 && <UserTable users={userMap.rank} selected={selected} />}
    </div>
  );
};

export default UserList;
