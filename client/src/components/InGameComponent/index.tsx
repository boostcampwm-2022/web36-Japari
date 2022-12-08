/** @jsxImportSource @emotion/react */
import * as style from "./styles";
import { User } from "@dto";
import { useCams } from "../../hooks/useCams";
import InGameCamList from "../InGameCamList";
import Chatting from "../Chatting";
import Game from "../Game";
import { GameRoom } from "../../pages/waiting";

export interface InGameComponentProps {
  room: GameRoom;
}

const InGameComponent = ({ room }: InGameComponentProps) => {
  const { videoStream, audioStream } = useCams();

  return (
    <div css={style.PlayingContentContainerStyle}>
      <InGameCamList
        participants={room.participants.filter((userInfo: User, idx: number) => idx % 2 === 0)}
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
        participants={room.participants.filter((userInfo: User, idx: number) => idx % 2 === 1)}
        videoStream={videoStream}
        audioStream={audioStream}
      />
    </div>
  );
};

export default InGameComponent;
