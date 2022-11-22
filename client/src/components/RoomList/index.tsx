/** @jsxImportSource @emotion/react */
import React from "react";
import Button from "../Button";
import CheckBox from "../CheckBox";
import Select from "../Select";
import RoomRecord from "./RoomRecord";
import * as style from "./styles";

interface Room {
  gameRoomId: string;
  title: string;
  gameId: number;
  currentPeople: number;
  maximumPeople: number;
  isPrivate: boolean;
}

export interface RoomListProps {
  rooms: Room[];
}

const RoomList = ({ rooms }: RoomListProps) => {
  //   const [rooms, setRooms] = useState<Room[]>([]);
  // or useQuery

  return (
    <div css={style.containerStyle}>
      <div css={style.headerStyle}>
        <div css={style.filterStyle}>
          <div css={style.checkBoxStyle}>
            <CheckBox />
            <span>공개 방만 보기</span>
          </div>
          <Select SelectType="게임 필터" />
        </div>
        <Button buttonType="방 만들기" handleClick={() => {}} />
      </div>

      <div css={style.roomListStyle}>
        {rooms.map(room => (
          <RoomRecord {...room} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
