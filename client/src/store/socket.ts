import { atom } from "recoil";
import io from "socket.io-client";

const socket = io(`${process.env.SOCKET_SERVER_URL}`, {
  // websocket으로 먼저 연결 시도 후 실패 시 polling으로 연결
  transports: ["websocket", "polling"],
  autoConnect: false,
});

export const socketState = atom({
  key: "socketState",
  default: socket,
});
