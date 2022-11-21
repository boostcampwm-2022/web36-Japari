/** @jsxImportSource @emotion/react */
import lockIcon from "../../../assets/icons/lock-icon.svg";
import { roomRecordStyle, divisionLineStyle } from "./styles";

const gameIdToName = new Map<number, string>();
gameIdToName.set(1, "Catch Mind");
gameIdToName.set(2, "Battleship");

export interface RoomRecordProps {
  isPrivate: boolean;
  title: string;
  gameId: number;
  currentPeople: number;
  maximumPeople: number;
}

const RoomRecord = ({ isPrivate, title, gameId, currentPeople, maximumPeople }: RoomRecordProps) => {
  return (
    <div css={roomRecordStyle}>
      {isPrivate ? <img src={lockIcon} /> : <div></div>}
      <div css={divisionLineStyle}></div>
      <span>{title}</span>
      <div css={divisionLineStyle}></div>
      <span>{gameIdToName.get(gameId)}</span>
      <div css={divisionLineStyle}></div>
      <span>
        {currentPeople} / {maximumPeople}
      </span>
    </div>
  );
};

export default RoomRecord;
