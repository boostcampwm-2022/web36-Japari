/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import { userState } from "../../store/user";
import useSocketConnect from "../../hooks/useSocketConnect";
import { GameRoom } from "../waiting";
import useSetUser from "../../hooks/useSetUser";
import InGameComponent from "../../components/InGameComponent";

const PlayingPage: React.FC = () => {
  const navigate = useNavigate();
  const socket = useRecoilValue(socketState);
  const user = useRecoilValue(userState);
  const [room, setRoom] = useState<GameRoom | null>(null);

  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  useSocketConnect();
  useSetUser();

  useEffect(() => {
    if (!user) return;
    socket.emit("play-room/enter", roomId, ({ room, ids }: { room: GameRoom; ids: number[] }) => {
      if (ids.includes(user.userId)) {
        setRoom(room);
      } else {
        navigate("/lobby");
      }
    });
    socket.on("game-room/info", data => {
      setRoom(data);
    });
    return () => {
      socket.emit("play-room/exit");
      socket.off("game-room/info");
    };
  }, [user, socket]);

  return <Page>{room && <InGameComponent room={room} />}</Page>;
};

export default PlayingPage;
