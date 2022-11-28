/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import RoomList from "../../components/RoomList";
import * as dummy from "../dummy";
import io from "socket.io-client";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/user";
import { getLoggedInUser } from "../../api/user";
import Modal from "../../components/Modal";

const LobbyPage: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [nicknameModalOpen, setNicknameModalOpen] = useState<boolean>(false);
  const socket = io(`${process.env.REACT_APP_SOCKET_SERVER_URL}`, {
    // websocket으로 먼저 연결 시도 후 실패 시 polling으로 연결
    transports: ["websocket", "polling"],
    autoConnect: false,
  });

  const closeModal = () => {
    setNicknameModalOpen(false);
  };

  useEffect(() => {
    getLoggedInUser().then(res => {
      setUser(res);
    });
  }, [setUser]);

  useEffect(() => {
    if (!user) return;
    if (!user.nickname) setNicknameModalOpen(true);
  }, [user]);

  useEffect(() => {
    socket.connect();
    console.log(socket);
    socket.emit("chat/lobby", { message: "hi" });
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
      {nicknameModalOpen && <Modal ModalType="닉네임 설정" closeModal={closeModal} />}
    </Page>
  );
};

export default LobbyPage;
