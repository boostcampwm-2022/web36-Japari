import axios from ".";

export const getGameRoomInfo = async (roomId: string) => {
  try {
    const res = await axios.get(`/gameroom/${roomId}`);
    return res.data;
  } catch {
    return null;
  }
};
