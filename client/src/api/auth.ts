import axios from ".";

const { REACT_APP_OAUTH_GITHUB_AUTH_SERVER } = process.env;

if (!REACT_APP_OAUTH_GITHUB_AUTH_SERVER) {
  throw new Error("환경 변수가 제대로 설정되지 않았습니다.");
}

export const githubLogin = () => {
  axios.get(REACT_APP_OAUTH_GITHUB_AUTH_SERVER);
};

export const isLogin = async () => {
  try {
    const res = await axios.get("/auth/is-login");
    return res.data.isLogin;
  } catch {
    return false;
  }
};

export const logout = async () => {
  try {
    const res = await axios.post("/auth/logout");
    return res.data;
  } catch {
    return false;
  }
};
