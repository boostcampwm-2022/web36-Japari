/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import * as style from "./styles";
import { Page } from "../../components/Page";
import InGameCamList from "../../components/InGameCamList";
import Chatting from "../../components/Chatting";
import Game from "../../components/Game";
import { User } from "@dto";
import { useLocation } from "react-router-dom";
import { useCams } from "../../hooks/useCams";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";

const PlayingPage: React.FC = () => {
  const socket = useRecoilValue(socketState);
  const [participants, setParticipants] = useState<User[]>([]);
  const location = useLocation();

  const { videoStream, audioStream } = useCams();

  useEffect(() => {
    setParticipants(location.state.participants);
    socket.on("game-room/info", data => {
      setParticipants(data.participants);
    });
    return () => {
      socket.emit("play-room/exit");
      socket.off("game-room/info");
    };
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
          <div css={style.GameContainerStyle}>
            {/* <Game gameId={location.state.gameId} /> */}
            <Game gameId={1} />
          </div>
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
