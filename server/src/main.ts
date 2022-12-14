import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { SERVER_PORT } from "./constants/config";
import * as mediasoup from "mediasoup";

export let worker: mediasoup.types.Worker;

const createWorker = async () => {
  worker = await mediasoup.createWorker({
    rtcMinPort: 20000,
    rtcMaxPort: 30000,
  });

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
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  await app.listen(SERVER_PORT);
}
bootstrap();
