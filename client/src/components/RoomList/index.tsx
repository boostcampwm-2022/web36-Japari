/** @jsxImportSource @emotion/react */
import { useEffect, useState, Fragment } from "react";
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
  minimumPeople: number;
  isPrivate: boolean;
}

export interface RoomListProps {
  rooms: Room[];
}

const RoomList = ({ rooms }: RoomListProps) => {
  const socket = useRecoilValue(socketState);
  const navigate = useNavigate();
  const [isPublicOnly, setIsPublicOnly] = useState<boolean>(false);
  const [gameType, setGameType] = useState<number>(0);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState<boolean>(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState<boolean>(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const onClickRecord = (roomId: string, isPrivate: boolean) => {
    if (isPrivate) {
      setSelectedRoomId(roomId);
      setPasswordModalOpen(true);
      return;
    }

    navigate(`/waiting/${roomId}`);
  };

  useEffect(() => {
    setFilteredRooms(
      rooms
        .filter(room => {
          if (!isPublicOnly) return true;
          if (!room.isPrivate) return true;
          return false;
        })
        .filter(room => {
          if (gameType === 0) return true;
          if (room.gameId === gameType) return true;
          return false;
        })
    );
  }, [rooms, gameType, isPublicOnly]);

  useEffect(() => {
    socket.on("game-room/create-success", data => {
      setCreateRoomModalOpen(false);
      navigate(`/waiting/${data.roomId}`);
    });
    socket.on("game-room/password-success", data => {
      setPasswordModalOpen(false);
      navigate(`/waiting/${data.roomId}`);
    });
    socket.on("game-room/password-failed", () => {
      setPasswordModalOpen(false);
      alert("??????????????? ???????????????.");
    });

    socket.on("game-room/error", errorMessage => {
      alert(errorMessage);
    });

    return () => {
      socket.off("game-room/create-success");
      socket.off("game-room/password-success");
      socket.off("game-room/password-failed");
      socket.off("game-room/error");
    };
  }, [navigate, socket]);

  useEffect(() => {}, [rooms, isPublicOnly, gameType]);

  return (
    <div css={style.containerStyle}>
      <div css={style.headerStyle}>
        <div css={style.filterStyle}>
          <div css={style.checkBoxStyle}>
            <CheckBox onChange={() => setIsPublicOnly(!isPublicOnly)} />
            <span>?????? ?????? ??????</span>
          </div>
          <Select selectType="?????? ??????" setValue={setGameType} />
        </div>
        <Button buttonType="??? ?????????" handleClick={() => setCreateRoomModalOpen(true)} />
        {createRoomModalOpen && (
          <Modal ModalType="??? ??????" closeModal={() => setCreateRoomModalOpen(false)} roomSettingMode="CREATE" />
        )}
      </div>

      <div css={style.roomListStyle}>
        {filteredRooms.map(room => (
          <Fragment key={room.roomId}>
            <RoomRecord {...room} onClickRecord={() => onClickRecord(room.roomId, room.isPrivate)} />
          </Fragment>
        ))}
      </div>
      {filteredRooms.length === 0 && (
        <p css={style.notificationStyle}>
          ?????? ?????? ????????????!
          <br /> ?????? ????????? ?????? ???????????? ????????? ???????????????!
        </p>
      )}
      {passwordModalOpen && (
        <Modal ModalType="???????????? ??????" roomId={selectedRoomId} closeModal={() => setPasswordModalOpen(false)} />
      )}
    </div>
  );
};

export default RoomList;
