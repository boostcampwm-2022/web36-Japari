/** @jsxImportSource @emotion/react */
import React, { useEffect, useState, Fragment } from "react";
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
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<number>(0);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);

  const onClickRecord = (roomId: string, isPrivate: boolean) => {
    if (isPrivate) {
      setPasswordModalOpen(true);
      return;
    }

    navigate(`/waiting/${roomId}`);
  };

  useEffect(() => {
    socket.on("game-room/create-success", data => {
      navigate(`/waiting/${data.roomId}`);
    });
    socket.on("game-room/password-success", data => {
      navigate(`/waiting/${data.roomId}`);
    });
    socket.on("game-room/password-failed", data => {
      alert(data);
    });

    socket.on("game-room/error", data => {
      alert(data);
    });

    return () => {
      socket.off("game-room/create-success");
      socket.off("game-room/password-success");
      socket.off("game-room/password-failed");
      socket.off("game-room/error");
    };
  }, [navigate, socket]);

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
        <Button buttonType="방 만들기" handleClick={() => setCreateRoomModalOpen(true)} />
        {createRoomModalOpen && <Modal ModalType="방 설정" closeModal={() => setCreateRoomModalOpen(false)} />}
      </div>

      <div css={style.roomListStyle}>
        {rooms.map(room => (
          <Fragment key={room.roomId}>
            <RoomRecord {...room} onClickRecord={() => onClickRecord(room.roomId, room.isPrivate)} />
            {passwordModalOpen && (
              <Modal ModalType="비밀번호 입력" roomId={room.roomId} closeModal={() => setPasswordModalOpen(false)} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default RoomList;
