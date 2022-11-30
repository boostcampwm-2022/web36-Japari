import axios from ".";

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
