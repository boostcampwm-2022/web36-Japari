/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import Button from "../Button";
import CheckBox from "../CheckBox";
import Modal from "../Modal";
import Select from "../Select";
import RoomRecord from "./RoomRecord";
import * as style from "./styles";

export interface Room {
  roomId: string;
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
  const socket = useRecoilValue(socketState);
  //   const [rooms, setRooms] = useState<Room[]>([]);
  // or useQuery
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onClickRecord = (roomId: string) => {
    socket.emit("game-room/join", { roomId });
    navigate(`/waiting/${roomId}`);
  };

  useEffect(() => {
    socket.on("game-room/create-success", data => {
      navigate(`/waiting/${data.roomId}`);
    });

    socket.on("game-room/error", data => {
      console.log(data);
    });

    return () => {
      socket.off("game-room/create-success");
      socket.off("game-room/error");
    };
  }, []);

  return (
    <div css={style.containerStyle}>
      <div css={style.headerStyle}>
        <div css={style.filterStyle}>
          <div css={style.checkBoxStyle}>
            <CheckBox />
            <span>공개 방만 보기</span>
          </div>
          <Select selectType="게임 필터" setValue={setGameType} />
        </div>
        <Button buttonType="방 만들기" handleClick={() => setIsModalOpen(true)} />
        {isModalOpen && <Modal ModalType="방 설정" closeModal={closeModal} />}
      </div>

      <div css={style.roomListStyle}>
        {rooms.map((room, index) => (
          <RoomRecord key={index} {...room} onClickRecord={() => onClickRecord(room.roomId)} />
        ))}
      </div>
    </div>
  );
};

export default RoomList;
