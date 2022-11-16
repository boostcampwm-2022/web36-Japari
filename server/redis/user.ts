import { redisCli } from "src/main";

export async function getUser(id) {
  console.log(await redisCli.get(`user-${id}`));
}

export async function setUser(id, data) {
  await redisCli.set(`user-${id}`, data);
}

export async function testFunction(id, data) {
  await setUser(id, data);
  await getUser(id);
}

// RedisService
