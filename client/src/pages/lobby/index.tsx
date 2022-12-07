/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import RoomList, { Room } from "../../components/RoomList";

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
  const [nicknameChangeModalOpen, setNicknameChangeModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setNicknameModalOpen(false);
    setNicknameChangeModalOpen(false);
  };

  useEffect(() => {
    if (!user) return;
    socket.io.opts.query = {
      "user-id": user.userId,
    };
    socket.connect();
  }, [user, socket]);

  useEffect(() => {
    if (!user) {
      getLoggedInUser().then(res => {
        setUser(res);
      });
      return;
    }
    if (!user.nickname) setNicknameModalOpen(true);
  }, [user, setUser]);

  useEffect(() => {
    socket.on("game-room/list", data => {
      setGameRooms(data);
    });
    return () => {
      socket.off("game-room/list");
    };
  }, [socket]);

  return (
    <Page>
      <div css={style.LobbyContentContainerStyle}>
        <div css={style.RowContentContainerStyle}>
          <UserList />
          <RoomList rooms={gameRooms} />
        </div>
        <div css={style.RowContentContainerStyle}>
          <Profile user={user} setNicknameChangeModalOpen={setNicknameChangeModalOpen} />
          <Chatting />
        </div>
      </div>
      {nicknameChangeModalOpen && <Modal ModalType="닉네임 설정" closeModal={closeModal} />}
      {nicknameModalOpen && <Modal ModalType="닉네임 설정" closeModal={closeModal} />}
    </Page>
  );
};

export default LobbyPage;
