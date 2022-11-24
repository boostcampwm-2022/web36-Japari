/** @jsxImportSource @emotion/react */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import CheckBox from "../CheckBox";
import Modal from "../Modal";
import Select from "../Select";
import RoomRecord from "./RoomRecord";
import * as style from "./styles";

export interface Room {
  gameRoomId: number;
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
  const navigate = useNavigate();

  return (
    <div css={style.containerStyle}>
      <div css={style.headerStyle}>
        <div css={style.filterStyle}>
          <div css={style.checkBoxStyle}>
            <CheckBox />
            <span>공개 방만 보기</span>
          </div>
          <Select selectType="게임 필터" />
        </div>
        <Button buttonType="방 만들기" handleClick={() => {}} />
      </div>

      <div css={style.roomListStyle}>
        {rooms.map((room, index) => (
          <RoomRecord key={index} {...room} onClickRecord={() => navigate(`/waiting/${room.gameRoomId}`)} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
