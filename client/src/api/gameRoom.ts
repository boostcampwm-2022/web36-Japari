import axios from ".";

const { REACT_APP_OAUTH_GITHUB_AUTH_SERVER } = process.env;

if (!REACT_APP_OAUTH_GITHUB_AUTH_SERVER) {
  throw new Error("환경 변수가 제대로 설정되지 않았습니다.");
}

export const getGameRoomInfo = async (roomId: string) => {
  try {
    const res = await axios.get(`/gameroom/${roomId}`);
    return res.data;
  } catch {
    return null;
  }
};
