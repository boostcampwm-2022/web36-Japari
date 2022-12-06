import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SERVER_SOCKET_PORT } from "./constants/config";
import { RedisTableName } from "./constants/enum";
import { GameRoomGateway } from "./modules/game-room/game-room.gateway";
import { PrismaService } from "./modules/prisma/prisma.service";
import { RedisService } from "./modules/redis/redis.service";

@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("App Gateway");

  constructor(private prisma: PrismaService, private redis: RedisService, private gameRoomGateway: GameRoomGateway) {}

  afterInit(server: Server) {
    this.logger.verbose("app gateway initiated");

    // (디버그용) Redis 데이터 전부 삭제
    /*
    this.redis.del(RedisTableName.SOCKET_ID_TO_USER_INFO);
    this.redis.del(RedisTableName.ONLINE_USERS);
    this.redis.del(RedisTableName.GAME_ROOMS);
    */
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const userId = Number(socket.handshake.query["user-id"]);
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) socket.disconnect();

    const userPublicInfo = {
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImage,
      score: user.score,
      connected: true,
    };

    socket.join("lobby");
    this.redis.setTo(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, { ...userPublicInfo, userId, roomId: "lobby" });
    this.redis.setTo(RedisTableName.ONLINE_USERS, String(userId), { ...userPublicInfo, socketId: socket.id });
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`socket ${socket.id} disconnected`);
    await this.gameRoomGateway.exit(socket);
    const { userId } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    this.redis.hdel(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    this.redis.hdel(RedisTableName.ONLINE_USERS, userId);
  }
}
