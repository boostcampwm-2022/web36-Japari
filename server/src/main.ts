import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get("SERVER_PORT");
  await app.listen(port);
}
bootstrap();
