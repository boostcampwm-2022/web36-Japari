import axios from ".";

//REACT_APP_OAUTH_GITHUB_AUTH_SERVER

export const githubLogin = () => {
  // axios.get("https://github.com/login/oauth/authorize?client_id=32059ec3adcaa13d8223&scope=read:user+user:email");
  axios.get("https://github.com/login/oauth/authorize?client_id=32059ec3adcaa13d8223");
};
