import { Module } from "@nestjs/common";
import { JwtModule } from "../jwt/jwt.module";
import { PrismaModule } from "../prisma/prisma.module";
import { ChatGateway } from "./chat.gateway";

@Module({
  imports: [JwtModule, PrismaModule],
  providers: [ChatGateway],
})
export class ChatModule {}
