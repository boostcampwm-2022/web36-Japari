import { Module } from "@nestjs/common";

import { UserController } from "./user.controller";

import { UserService } from "./user.service";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { RedisModule } from "../redis/redis.module";

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
