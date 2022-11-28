/** @jsxImportSource @emotion/react */
import React, { useEffect } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import RoomList from "../../components/RoomList";
import * as dummy from "../dummy";
import io from "socket.io-client";
// const socket = io(`${process.env.REACT_APP_SOCKET_SERVER_URL}`, {
//   // websocket으로 먼저 연결 시도 후 실패 시 polling으로 연결
//   transports: ["websocket", "polling"],
//   autoConnect: false,
// });

const LobbyPage: React.FC = () => {
  // user 정보 로직

  console.log(1);
  useEffect(() => {
    // socket.connect();
    // socket.emit("chat/lobby", { message: "hi" });
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
