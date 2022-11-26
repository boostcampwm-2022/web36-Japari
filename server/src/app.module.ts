import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { GameModule } from "./modules/game/game.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ChatModule } from "./modules/chat/chat.module";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RedisModule } from "./modules/redis/redis.module";
import redisConfig from "./config/redis.config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    GameModule,
    PrismaModule,
    RedisModule.registerAsync(redisConfig),
    ChatModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
