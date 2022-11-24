import * as oldAxios from "axios";

const axios = oldAxios.default.create({
  baseURL: "/api",
  withCredentials: true,
});

export default axios;
