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
    const jwtAccessToken = socket.handshake.query["jwt-access-token"] as string;

    try {
      const payload = this.jwt.verify(jwtAccessToken);
      const { userId } = payload;

      const user = await this.prisma.user.findUnique({
        where: { userId },
      });

      console.log({ [socket.id]: user.email });

      this.redis.hmset("socket-id-to-user-name", { [socket.id]: user.email });
    } catch (e) {
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.redis.hdel("socket-id-to-user-name", socket.id);
  }
}
