import { Module } from "@nestjs/common";

import { GameController } from "./game.controller";

import { GameService } from "./game.service";
import { PrismaModule } from "src/modules/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
