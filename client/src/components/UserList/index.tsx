/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import UserListTab from "./UserListTab";
import UserTable from "./UserTable";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import * as style from "./styles";
import Spinner from "../Loader/Spinner";
import { getTopUsers } from "../../api/user";

export type User = {
  userId: number;
  email: string;
  nickname: string;
  score: number;
  profileImage: string;
  connected: boolean;
};

export interface UserListProps {
  users: User[];
  friends: User[];
  topUsers: User[];
}

const UserList = () => {
  const socket = useRecoilValue(socketState);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number>(0);
  const [userMap, setUserMap] = useState<UserListProps>({
    users: [],
    friends: [],
    topUsers: [],
  });

  useEffect(() => {
    socket.on("user/online", data => {
      setUserMap(current => {
        return { ...current, users: Object.values(data) };
      });
      setLoading(false);
    });
    return () => {
      socket.off("user/online");
    };
  }, [socket]);

  useEffect(() => {
    if (selected === 2) {
      setLoading(true);
      getTopUsers().then(topUsers => {
        setUserMap(current => {
          return { ...current, topUsers };
        });
        setLoading(false);
      });
    }
  }, [selected]);

  return (
    <div css={style.ListContainerStyle}>
      <UserListTab selected={selected} setSelected={setSelected} />

      <div css={style.TableContainerStyle}>
        {loading ? (
          <Spinner color="#bbbbbb" />
        ) : (
          <>
            {selected === 0 && <UserTable users={userMap.users} selected={selected} />}
            {selected === 1 && <UserTable users={userMap.friends} selected={selected} />}
            {selected === 2 && <UserTable users={userMap.topUsers} selected={selected} />}
          </>
        )}
      </div>
    </div>
  );
};

export default UserList;
