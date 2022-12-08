import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { socketState } from "../store/socket";
import { userState } from "../store/user";

function useSocketConnect() {
  const user = useRecoilValue(userState);
  const socket = useRecoilValue(socketState);

  useEffect(() => {
    if (!user) return;
    if (socket.connected) return;
    socket.io.opts.query = {
      "user-id": user.userId,
    };
    socket.connect();
  }, [user, socket]);
}

export default useSocketConnect;
