import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";

import { AppService } from "./app.service";

import { AuthModule } from "./auth/auth.module";
import { GameModule } from "./game/game.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ChatModule } from "./chat/chat.module";

@Module({
  imports: [AuthModule, GameModule, PrismaModule, ChatModule],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
