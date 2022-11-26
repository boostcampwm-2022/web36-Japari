import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { GameModule } from "./modules/game/game.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { ChatModule } from "./modules/chat/chat.module";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, GameModule, PrismaModule, ChatModule],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
