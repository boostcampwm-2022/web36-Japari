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
    this.redis.del("socket-id-to-user-name");
    this.redis.del("socket-id-to-room-id");
    this.redis.del("online-users");
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const jwtAccessToken = socket.handshake.query["jwt-access-token"] as string;

    try {
      const payload = this.jwt.verify(jwtAccessToken);
      const { userId } = payload;

      const user = await this.prisma.user.findUnique({
        where: { userId },
      });
      const userPublicInfo = {
        email: user.email,
        nickname: user.nickname,
        socketId: socket.id,
        profileImage: user.profileImage,
        score: user.score,
      };

      this.redis.hmset("socket-id-to-user-id", { [socket.id]: user.userId }); // user name needed
      this.redis.hmset("socket-id-to-user-name", { [socket.id]: user.email }); // user name needed
      this.redis.hmset("socket-id-to-room-id", { [socket.id]: "lobby" });
      this.redis.hmset("online-users", { [userId]: JSON.stringify(userPublicInfo) });
      socket.join("lobby");
    } catch (e) {
      socket.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const userId = (await this.redis.hmget("socket-id-to-user-id", socket.id))[0];
    this.redis.hdel("socket-id-to-user-id", socket.id);
    this.redis.hdel("socket-id-to-user-name", socket.id);
    this.redis.hdel("online-users", userId);
    const room = (await this.redis.hmget("socket-id-to-room-id", socket.id))[0];
    this.redis.hdel("socket-id-to-room-id", socket.id);
    socket.leave(room);
  }
}
