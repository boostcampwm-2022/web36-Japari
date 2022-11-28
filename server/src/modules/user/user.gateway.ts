import { Inject, Logger, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import Redis from "ioredis";
import { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";

@WebSocketGateway(4001, { transports: ["websocket"], namespace: "/" })
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");

  constructor(private jwt: JwtService, private prisma: PrismaService, @Inject("RedisProvider") private redis: Redis) {}

  afterInit(server: Server) {
    setInterval(async () => {
      const records = await this.redis.hgetall("online-users");

      const users = {};
      Object.entries(records).forEach(([userId, userPublicInfo]) => {
        users[userId] = JSON.parse(userPublicInfo);
      });

      server.emit("user/online", users);
    }, 1000);

    this.logger.verbose("user gateway initiated");
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
