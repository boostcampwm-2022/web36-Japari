import { socketState } from "./../store/socket";
import { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";

export function Receiver(channel: string, onReceive: (data: any) => void) {
  const socket = useRecoilValue(socketState);
  useEffect(() => {
    socket.on(channel, onReceive);
    return () => {
      socket.off(channel, onReceive);
    };
  }, [channel, onReceive, socket]);
}

export function Sender(channel: string) {
  const socket = useRecoilValue(socketState);
  const emitter = (data: object) => {
    socket.emit(channel, data);
  };

  return useCallback(emitter, [channel, socket]);
}
