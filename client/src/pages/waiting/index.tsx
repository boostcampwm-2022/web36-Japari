/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import * as dummy from "../dummy";
import WaitingRoomInfo from "../../components/WaitingRoomInfo";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import { getLoggedInUser } from "../../api/user";
import { socketState } from "../../store/socket";
import { getGameRoomInfo } from "../../api/gameRoom";
import { useLocation } from "react-router-dom";

type GameRoom = {
  title: string;
  gameId: number;
  maximumPeople: number;
  isPrivate: boolean;
  password: string;
  minimumPeople: number;
  participants: any[];
};

const WaitingPage: React.FC = () => {
  const socket = useRecoilValue(socketState);
  const [user, setUser] = useRecoilState(userState);
  const [room, setRoom] = useState<GameRoom | null>(null);

  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  useEffect(() => {
    if (!user) {
      getLoggedInUser().then(res => {
        setUser(res);
      });
      return;
    }
  }, [user, setUser]);

  useEffect(() => {
    socket.on("game-room/info", data => {
      setRoom(data);
    });
    socket.emit("game-room/join", { roomId });
    return () => {
      socket.emit("game-room/exit");
      socket.off("game-room/info");
    };
  }, [roomId, socket]);

  return (
    <Page>
      <div css={style.WaitingContentContainerStyle}>
        <div css={style.RowContentContainerStyle}>
          <UserList />
          {room && (
            <WaitingRoomInfo
              roomRecord={{
                roomId,
                ...room,
                currentPeople: room.participants.length,
                gameId: Number(room.gameId),
              }}
            />
          )}
        </div>
        <div css={style.RowContentContainerStyle}>
          <Profile user={user} />
          <Chatting />
        </div>
      </div>
    </Page>
  );
};

export default WaitingPage;
