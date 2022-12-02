import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { ConfigService } from "@nestjs/config";
import { WebSocketGateway } from "@nestjs/websockets";
import { ChatGateway } from "./modules/chat/chat.gateway";
import { GameRoomGateway } from "./modules/game-room/game-room.gateway";
import { UserGateway } from "./modules/user/user.gateway";
import { AppGateway } from "./app.gateway";

function decorateGateway(class_, config) {
  WebSocketGateway(config.get("SERVER_SOCKET_PORT"), {
    transports: ["websocket"],
    namespace: `/${config.get("NAMESPACE")}`,
  })(class_);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(cookieParser());
  const config: ConfigService = app.get(ConfigService);
  const port = config.get("SERVER_PORT");
  decorateGateway(ChatGateway, config);
  decorateGateway(GameRoomGateway, config);
  decorateGateway(UserGateway, config);
  decorateGateway(AppGateway, config);
  await app.listen(port);
}
bootstrap();
