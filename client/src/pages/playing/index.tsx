/** @jsxImportSource @emotion/react */
import React from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import { camList } from "../dummy";
import InGameCamList from "../../components/InGameCamList";
import Chatting from "../../components/Chatting";
import Game from "../../components/Game";
import { useLocation } from "react-router-dom";

const PlayingPage: React.FC = () => {
  // user 정보 로직
  const camsLeft = camList.filter((cam, idx) => idx % 2 === 0);
  const camsRight = camList.filter((cam, idx) => idx % 2 === 1);

  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  return (
    <Page>
      <div css={style.PlayingContentContainerStyle}>
        <InGameCamList camList={camsLeft} />
        <div css={style.GameAndChatContainerStyle}>
          <div css={style.GameContainerStyle}>
            {/* <Game gameId={location.state.gameId} /> */}
            <Game gameId={1} />
          </div>
          <Chatting />
        </div>
        <InGameCamList camList={camsRight} />
      </div>
    </Page>
  );
};

export default PlayingPage;
