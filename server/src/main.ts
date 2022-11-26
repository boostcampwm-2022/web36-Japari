import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as path from "path";
import * as redis from "redis";
import * as cookieParser from "cookie-parser";
// import { testFunction } from "redis/user";

// const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env;

// const redisClient = redis.createClient({
//   legacyMode: true,
//   url: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
// });

// redisClient.on("connect", () => {
//   console.info("Redis connected!");

//   // testFunction(1, "redis 데이터");
// });

// redisClient.on("error", err => {
//   console.error("Redis Client Error", err);
// });

// redisClient.connect().then();
// export const redisCli = redisClient.v4;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
