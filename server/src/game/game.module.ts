import { Module } from "@nestjs/common";

import { GameController } from "./game.controller";

import { GameService } from "./game.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [],

  controllers: [GameController],
  providers: [GameService, PrismaService],
})
export class GameModule {}
