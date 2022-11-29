/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import RoomList, { Room } from "../../components/RoomList";
import * as dummy from "../dummy";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../store/user";
import { getLoggedInUser } from "../../api/user";
import Modal from "../../components/Modal";
import { socketState } from "../../store/socket";

const LobbyPage: React.FC = () => {
  const socket = useRecoilValue(socketState);
  const [user, setUser] = useRecoilState(userState);
  const [gameRooms, setGameRooms] = useState<Room[]>([]);
  const [nicknameModalOpen, setNicknameModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setNicknameModalOpen(false);
  };

  useEffect(() => {
    if (!user) return;
    socket.io.opts.query = {
      "user-id": user.userId,
    };
    socket.connect();
  }, [user]);

  useEffect(() => {
    if (!user) {
      getLoggedInUser().then(res => {
        setUser(res);
      });
      return;
    }

    if (!user.nickname) setNicknameModalOpen(true);
  }, [user]);

  useEffect(() => {
    socket.on("game-room/list", data => {
      console.log(data);
      setGameRooms(data);
    });
    return () => {
      socket.off("gmae-room/list");
    };
  }, []);

  return (
    <Page>
      <div css={style.LobbyContentContainerStyle}>
        <div css={style.RowContentContainerStyle}>
          <UserList userMap={dummy.dummyUserMap} />
          <RoomList rooms={gameRooms} />
        </div>
        <div css={style.RowContentContainerStyle}>
          <Profile user={user} />
          <Chatting />
        </div>
      </div>
      {nicknameModalOpen && <Modal ModalType="닉네임 설정" closeModal={closeModal} />}
    </Page>
  );
};

export default LobbyPage;
