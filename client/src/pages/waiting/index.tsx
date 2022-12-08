/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import WaitingRoomInfo from "../../components/WaitingRoomInfo";
import { useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import { socketState } from "../../store/socket";
import { useLocation, useNavigate } from "react-router-dom";
import useSocketConnect from "../../hooks/useSocketConnect";
import useSetUser from "../../hooks/useSetUser";

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
  const navigate = useNavigate();
  const socket = useRecoilValue(socketState);
  const user = useRecoilValue(userState);
  const [room, setRoom] = useState<GameRoom | null>(null);

  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  useSocketConnect();
  useSetUser();

  useEffect(() => {
    socket.on("game-room/info", data => {
      setRoom(data);
    });
    socket.on("game-room/join-failed", data => {
      navigate("/lobby");
    });
    socket.on("fully connected", () => {
      socket.emit("game-room/join", { roomId });
    });
    socket.emit("game-room/join", { roomId });

    return () => {
      socket.off("fully connected");
      socket.off("game-room/info");
      socket.off("game-room/join-failed");
      socket.emit("wait-room/exit");
    };
  }, [socket]);

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
              participants={room.participants}
            />
          )}
        </div>
        <div css={style.RowContentContainerStyle}>
          <Profile user={user} editable={false} />
          <Chatting />
        </div>
      </div>
    </Page>
  );
};

export default WaitingPage;
