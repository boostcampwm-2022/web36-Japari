/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import WaitingRoomInfo from "../../components/WaitingRoomInfo";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import { socketState } from "../../store/socket";
import { useLocation, useNavigate } from "react-router-dom";
import useSocketConnect from "../../hooks/useSocketConnect";
import useSetUser from "../../hooks/useSetUser";
import { soundState } from "../../store/sound";

export type GameRoom = {
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
  const [user, setUser] = useRecoilState(userState);
  const [room, setRoom] = useState<GameRoom | null>(null);
  const { sound, soundId } = useRecoilValue(soundState);

  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  useSocketConnect();
  useSetUser();

  useEffect(() => {
    socket.on("game-room/info", (room: GameRoom) => {
      setRoom(room);
    });
    socket.on("game-room/join-failed", () => {
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
  }, [socket, navigate, roomId]);

  useEffect(() => {
    socket.on("game-room/info", (room: GameRoom) => {
      if (user) {
        const newUser = room.participants.filter(participant => participant.userId === user.userId)[0];
        setUser({ ...user, score: newUser.score });
      }
    });
  }, [socket, user, setUser]);

  useEffect(() => {
    sound.volume(0.05, soundId);

    return () => {
      sound.volume(0.1, soundId);
    };
  }, [sound, soundId]);

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
