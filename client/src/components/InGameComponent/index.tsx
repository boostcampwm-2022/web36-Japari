/** @jsxImportSource @emotion/react */
import { useState, useCallback, useEffect } from "react";
import * as style from "./styles";
import { User } from "@dto";
import { useCams, StreamInfo } from "../../hooks/useCams";
import InGameCamList from "../InGameCamList";
import Chatting from "../Chatting";
import Game from "../Game";
import { GameRoom } from "../../pages/waiting";
import { Socket } from "socket.io-client";

export interface InGameComponentProps {
  room: GameRoom;
  socket: Socket;
}

const InGameComponent = ({ room, socket }: InGameComponentProps) => {
  const { videoStream, audioStream } = useCams();

  return (
    <div css={style.PlayingContentContainerStyle}>
      <InGameCamList
        participants={room.participants.filter((userInfo: User, idx: number) => idx % 2 === 0)}
        videoStream={videoStream}
        audioStream={audioStream}
        socket={socket}
      />
      <div css={style.GameAndChatContainerStyle}>
        <div css={style.GameContainerStyle}>
          {/* <Game gameId={location.state.gameId} /> */}
          <Game gameId={1} participants={room.participants} />
        </div>
        <Chatting />
      </div>
      <InGameCamList
        participants={room.participants.filter((userInfo: User, idx: number) => idx % 2 === 1)}
        videoStream={videoStream}
        audioStream={audioStream}
        socket={socket}
      />
    </div>
  );
};

export default InGameComponent;
