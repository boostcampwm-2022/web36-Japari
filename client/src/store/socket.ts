import { atom } from "recoil";
import { io, Socket } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_SOCKET_SERVER_URL}`, {
  // websocket으로 먼저 연결 시도 후 실패 시 polling으로 연결
  transports: ["websocket", "polling"],
  autoConnect: false,
});

export const socketState = atom<Socket>({
  key: "socketState",
  default: socket,
  dangerouslyAllowMutability: true,
});
