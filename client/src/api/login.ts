import axios from ".";

export const githubLogin = () => {
  axios.get("https://github.com/login/oauth/authorize?client_id=32059ec3adcaa13d8223");
};
