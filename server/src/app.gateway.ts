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
import { PrismaService } from "./modules/prisma/prisma.service";

@WebSocketGateway(4001, { transports: ["websocket"], namespace: "/" })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("App Gateway");

  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    @Inject("RedisProvider") private readonly redis: Redis
  ) {}

  afterInit(server: Server) {
    this.logger.verbose("app gateway initiated");
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const user = { email: "test" };

    this.logger.verbose({ [socket.id]: user.email });
    this.redis.hmset("socket-id-to-user-name", { [socket.id]: user.email });
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.redis.hdel("socket-id-to-user-name", socket.id);
    const room = (await this.redis.hmget("socket-id-to-room-id", socket.id))[0];
    socket.leave(room);
  }
}
