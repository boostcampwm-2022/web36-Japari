/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import { camList } from "../dummy";
import InGameCamList from "../../components/InGameCamList";
import Chatting from "../../components/Chatting";
import { User } from "@dto";
import { getGameRoomInfo } from "../../api/gameRoom";
import { useLocation, useNavigate } from "react-router-dom";
import { StreamInfo, useCams } from "../../hooks/useCams";

const PlayingPage: React.FC = () => {
  const [participants, setParticipants] = useState<User[]>([]);
  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  const { videoStream, audioStream } = useCams();

  useEffect(() => {
    getGameRoomInfo(roomId).then(res => {
      setParticipants(res.participants);
    });
  }, []);

  return (
    <Page>
      <div css={style.PlayingContentContainerStyle}>
        <InGameCamList
          participants={participants.filter((userInfo: User, idx: number) => idx % 2 === 0)}
          videoStream={videoStream}
          audioStream={audioStream}
        />
        <div css={style.GameAndChatContainerStyle}>
          <div css={style.GameContainerStyle}>게임</div>
          <Chatting />
        </div>
        <InGameCamList
          participants={participants.filter((userInfo: User, idx: number) => idx % 2 === 1)}
          videoStream={videoStream}
          audioStream={audioStream}
        />
      </div>
    </Page>
  );
};

export default PlayingPage;
