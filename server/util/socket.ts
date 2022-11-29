import { Socket } from "socket.io";

export const getRoomId = (socket: Socket) => {
  return [...socket.rooms].filter(value => value !== socket.id)[0];
};
