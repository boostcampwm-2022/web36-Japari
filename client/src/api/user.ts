import axios from ".";

const { REACT_APP_OAUTH_GITHUB_AUTH_SERVER } = process.env;

if (!REACT_APP_OAUTH_GITHUB_AUTH_SERVER) {
  throw new Error("환경 변수가 제대로 설정되지 않았습니다.");
}

export const getLoggedInUser = async () => {
  try {
    const res = await axios.get("/user/");
    return res.data;
  } catch {
    return null;
  }
};

export const updateNickname = async (nickname: string) => {
  try {
    const res = await axios.patch("/user/nickname", { nickname });
    return res.data;
  } catch {
    throw new Error("닉네임 설정 오류");
  }
};
