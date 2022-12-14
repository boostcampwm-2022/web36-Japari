import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";

import { UserService } from "./user.service";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";
import { UserGateway } from "./user.gateway";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, RedisModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserGateway],
})
export class UserModule {}
