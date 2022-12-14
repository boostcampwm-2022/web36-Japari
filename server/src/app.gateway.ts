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
import { CatchMindGateway } from "./modules/play/catch-mind.gateway";
import { PrismaService } from "./modules/prisma/prisma.service";
import { RedisService } from "./modules/redis/redis.service";

@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("App Gateway");

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private gameRoomGateway: GameRoomGateway,
    private catchMindGateway: CatchMindGateway
  ) {}

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
    await this.redis.setTo(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, {
      ...userPublicInfo,
      userId,
      roomId: "lobby",
    });
    await this.redis.setTo(RedisTableName.ONLINE_USERS, String(userId), { ...userPublicInfo, socketId: socket.id });

    socket.emit("fully connected");
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    // Redis 테이블 갱신

    // 1. play-data
    await this.catchMindGateway.exit(socket);

    // 2. game-rooms
    await this.gameRoomGateway.exit(socket);

    // 3. online-users
    // 같은 소켓 id를 value.socketId에 포함하는 레코드를 지운다.
    const allUsers = await this.redis.hgetall(RedisTableName.ONLINE_USERS);
    const userIdToRemove = Object.entries(allUsers)
      .map(([key, value]) => {
        return [key, JSON.parse(value)];
      })
      .filter(([, userInfo]) => userInfo.socketId === socket.id)
      .map(([userId]) => Number(userId))[0];

    await this.redis.hdel(RedisTableName.ONLINE_USERS, String(userIdToRemove));

    // 4. socket-id-to-user-info
    // value.userId가 userIdToRemove인 레코드를 전부 지운다.
    const allSocketUsers = await this.redis.hgetall(RedisTableName.SOCKET_ID_TO_USER_INFO);
    const relatedSocketIdList = Object.entries(allSocketUsers)
      .map(([key, value]) => {
        return [key, JSON.parse(value)];
      })
      .filter(([, userInfo]) => userInfo.userId === userIdToRemove)
      .map(([socketId]) => socketId);

    for (const socketId of relatedSocketIdList) {
      // socket-id-to-user-info
      await this.redis.hdel(RedisTableName.SOCKET_ID_TO_USER_INFO, socketId);
    }
  }
}
