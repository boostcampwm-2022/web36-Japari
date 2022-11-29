/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
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
import Modal from "../../components/Modal";

const LobbyPage: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);
  const [nicknameModalOpen, setNicknameModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setNicknameModalOpen(false);
  };

  useEffect(() => {
    if (!user) {
      getLoggedInUser().then(res => {
        setUser(res);
      });
      return;
    }

    if (!user.nickname) setNicknameModalOpen(true);
  }, [user]);

  return (
    <Page>
      <div css={style.LobbyContentContainerStyle}>
        <div css={style.RowContentContainerStyle}>
          <UserList userMap={dummy.dummyUserMap} />
          <RoomList rooms={dummy.dummyRooms} />
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
