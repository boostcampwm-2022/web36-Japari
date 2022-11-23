/** @jsxImportSource @emotion/react */
import React from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import RoomList from "../../components/RoomList";
import * as dummy from "./dummy";

const LobbyPage: React.FC = () => {
  // user 정보 로직

  return (
    <Page>
      <div css={style.LobbyContentContainer}>
        <div css={style.RowContentContainer}>
          <UserList userMap={dummy.dummyUserMap} />
          <RoomList rooms={dummy.dummyRooms} />
        </div>
        <div css={style.RowContentContainer}>
          <Profile user={dummy.dummyUser} />
          <Chatting />
        </div>
      </div>
    </Page>
  );
};

export default LobbyPage;
