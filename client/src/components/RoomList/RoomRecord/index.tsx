/** @jsxImportSource @emotion/react */
import lockIcon from "../../../assets/icons/lock-icon.svg";
import * as style from "./styles";

const gameIdToName = new Map<number, string>();
gameIdToName.set(1, "Catch Mind");
gameIdToName.set(2, "Battleship");

export interface RoomRecordProps {
  isPrivate: boolean;
  title: string;
  gameId: number;
  currentPeople: number;
  maximumPeople: number;
  onClickRecord?: () => void;
}

const RoomRecord = ({ isPrivate, title, gameId, currentPeople, maximumPeople, onClickRecord }: RoomRecordProps) => {
  return (
    <div css={style.roomRecordStyle} onClick={onClickRecord}>
      {isPrivate ? (
        <img css={style.roomRecordPrivateIconStyle} src={lockIcon} alt="private-icon" />
      ) : (
        <div css={style.roomRecordPrivateIconStyle} />
      )}
      <div css={style.divisionLineStyle}></div>
      <span css={style.roomRecordTitleStyle}>{title}</span>
      <div css={style.divisionLineStyle}></div>
      <span css={style.roomRecordGameTypeStyle}>{gameIdToName.get(gameId)}</span>
      <div css={style.divisionLineStyle}></div>
      <span css={style.roomRecordPeopleStyle}>
        {currentPeople} / {maximumPeople}
      </span>
    </div>
  );
};

export default RoomRecord;
