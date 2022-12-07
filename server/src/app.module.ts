import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { GameModule } from "./modules/game/game.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ChatModule } from "./modules/chat/chat.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RedisModule } from "./modules/redis/redis.module";
import { AppGateway } from "./app.gateway";
import { JwtModule } from "./modules/auth/jwt/jwt.module";
import { UserModule } from "./modules/user/user.module";
import { GameRoomModule } from "./modules/game-room/game-room.module";
import { MediaModule } from "./modules/media/media.module";
import { PlayModule } from "./modules/play/play.module";

@Module({
  imports: [
    AuthModule,
    GameModule,
    PrismaModule,
    JwtModule,
    RedisModule,
    ChatModule,
    UserModule,
    GameRoomModule,
    MediaModule,
    PlayModule,
  ],

  controllers: [AppController],

  providers: [AppService, AppGateway],
})
export class AppModule {}
