/** @jsxImportSource @emotion/react */
import React, { useEffect } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import RoomList from "../../components/RoomList";
import * as dummy from "../dummy";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/user";
import { getLoggedInUser } from "../../api/user";

const LobbyPage: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    getLoggedInUser().then(res => {
      setUser(res);
    });
  }, []);

  return (
    <Page>
      <div css={style.LobbyContentContainerStyle}>
        <div css={style.RowContentContainerStyle}>
          <UserList userMap={dummy.dummyUserMap} />
          <RoomList rooms={dummy.dummyRooms} />
        </div>
        <div css={style.RowContentContainerStyle}>
          <Profile user={dummy.dummyUser} />
          <Chatting />
        </div>
      </div>
    </Page>
  );
};

export default LobbyPage;
