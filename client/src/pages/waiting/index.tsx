/** @jsxImportSource @emotion/react */
import React, { useEffect } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import Profile from "../../components/Profile";
import UserList from "../../components/UserList";
import Chatting from "../../components/Chatting";
import * as dummy from "../dummy";
import WaitingRoomInfo from "../../components/WaitingRoomInfo";
import { useRecoilState } from "recoil";
import { userState } from "../../recoil/user";
import { getLoggedInUser } from "../../api/user";

const WaitingPage: React.FC = () => {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    if (!user) {
      getLoggedInUser().then(res => {
        setUser(res);
      });
      return;
    }
  }, [user]);

  return (
    <Page>
      <div css={style.WaitingContentContainerStyle}>
        <div css={style.RowContentContainerStyle}>
          <UserList userMap={dummy.dummyUserMap} />
          <WaitingRoomInfo roomRecord={dummy.roomRecord} camList={dummy.camList} />
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
