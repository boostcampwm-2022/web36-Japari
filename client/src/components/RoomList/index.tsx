/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import Button from "../Button";
import RoomRecord from "./RoomRecord";
import { containerStyle, roomListHeaderStyle, roomListStyle } from "./styles";

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
    <div css={containerStyle}>
      <div css={roomListHeaderStyle}>
        <input type="checkbox" id="room-list-filter-public-only" />
        <label htmlFor="room-list-filter-public-only">공개 방만 보기</label>
        <select>
          <option value="0">모든 게임</option>
          <option value="1">Catch Mind</option>
          <option value="2">BattleShip</option>
        </select>
      </div>
      <Button buttonType="방 만들기" handleClick={() => {}} />

      <div css={roomListStyle}>
        {rooms.map(room => (
          <RoomRecord {...room} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
