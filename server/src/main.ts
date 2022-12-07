import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { SERVER_PORT } from "./constants/config";
import * as mediasoup from "mediasoup";
import { readFileSync } from "fs";

export let worker: mediasoup.types.Worker;

const httpsOptions = {
  key: readFileSync("src/ssl/key.pem", "utf-8"),
  cert: readFileSync("src/ssl/cert.pem", "utf-8"),
};

const createWorker = async () => {
  worker = await mediasoup.createWorker();

  worker.on("died", err => {
    console.error("worker has died");
    setTimeout(() => process.exit(1), 2000);
  });

  return worker;
};

createWorker().then(res => {
  worker = res;
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions, cors: true });
  app.use(cookieParser());
  await app.listen(SERVER_PORT);
}
bootstrap();
