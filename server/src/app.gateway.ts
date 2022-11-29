import { Inject, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import Redis from "ioredis";
import { Server, Socket } from "socket.io";
import { getRoomId } from "util/socket";
import { RedisTableName } from "./constants/redis-table-name";
import { GameroomGateway } from "./modules/game-room/game-room.gateway";
import { PrismaService } from "./modules/prisma/prisma.service";

@WebSocketGateway(4001, { transports: ["websocket"], namespace: "/" })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("App Gateway");

  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
    @Inject("RedisProvider") private readonly redis: Redis,
    private gameRoomGateway: GameroomGateway
  ) {}

  afterInit(server: Server) {
    this.logger.verbose("app gateway initiated");
    this.redis.del(RedisTableName.SOCKET_ID_TO_USER_INFO);
    this.redis.del(RedisTableName.ONLINE_USERS);
    this.redis.del(RedisTableName.GAME_ROOMS);
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const userId = Number(socket.handshake.query["user-id"]);

    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) socket.disconnect();

    socket.join("lobby");

    const userPublicInfo = {
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      score: user.score,
    };

    this.redis.hset(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, JSON.stringify(userPublicInfo));
    this.redis.hset(RedisTableName.ONLINE_USERS, userId, JSON.stringify(userPublicInfo));
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    const userId = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
    this.redis.hdel(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    this.redis.hdel(RedisTableName.ONLINE_USERS, userId);

    if (!getRoomId(socket)) {
      return;
    }

    if (getRoomId(socket) === "lobby") {
      socket.leave("lobby");
      return;
    }

    this.gameRoomGateway.exit(socket);
  }
}
