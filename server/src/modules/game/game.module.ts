import { Module } from "@nestjs/common";

import { GameController } from "./game.controller";

import { GameService } from "./game.service";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";
import { JwtModule } from "../auth/jwt/jwt.module";

@Module({
  imports: [PrismaModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
