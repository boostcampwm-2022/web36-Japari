import * as oldAxios from "axios";

const axios = oldAxios.default.create({
  withCredentials: true,
});

export default axios;
