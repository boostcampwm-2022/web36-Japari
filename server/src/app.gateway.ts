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
    await this.redis.setTo(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, {
      ...userPublicInfo,
      userId,
      roomId: "lobby",
    });
    await this.redis.setTo(RedisTableName.ONLINE_USERS, String(userId), { ...userPublicInfo, socketId: socket.id });

    socket.emit("fully connected");
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.warn(`socket ${socket.id} disconnected`);

    // Redis 테이블 갱신

    // 1. online-users
    // 같은 소켓 id를 value.socketId에 포함하는 레코드를 지운다.
    const allUsers = await this.redis.hgetall(RedisTableName.ONLINE_USERS);
    const userIdToRemove = Object.entries(allUsers)
      .map(([key, value]) => {
        return [key, JSON.parse(value)];
      })
      .filter(([, userInfo]) => userInfo.socketId === socket.id)
      .map(([userId]) => Number(userId))[0];

    await this.redis.hdel(RedisTableName.ONLINE_USERS, String(userIdToRemove));

    // 2. socket-id-to-user-info
    // value.userId가 userIdToRemove인 레코드를 전부 지운다.
    // 3. game-rooms
    // key가 roomId인 레코드 room에 대하여
    // room.patricipants를 순회하면서 userId가 userIdToRemove인 레코드를 전부 지운다.
    // 4. play-data
    // key가 roomId인 레코드 playData에 대하여
    // playData.scores[userIdToRemove], playData.totalScores[userIdToRemove]를 삭제한다.
    const allSocketUsers = await this.redis.hgetall(RedisTableName.SOCKET_ID_TO_USER_INFO);
    const relatedSocketIdAndRoomIdList = Object.entries(allSocketUsers)
      .map(([key, value]) => {
        return [key, JSON.parse(value)];
      })
      .filter(([, userInfo]) => userInfo.userId === userIdToRemove)
      .map(([socketId, userInfo]) => [socketId, userInfo.roomId]);

    const usedRoomId = new Map();

    for (const [socketId, roomId] of relatedSocketIdAndRoomIdList) {
      // socket-id-to-user-info
      await this.redis.hdel(RedisTableName.SOCKET_ID_TO_USER_INFO, socketId);

      // roomId 중복 체크
      if (usedRoomId.has(roomId)) {
        continue;
      }
      usedRoomId.set(roomId, true);

      // game-rooms
      const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);

      if (room) {
        room.participants = room.participants.filter(user => user.userId !== userIdToRemove);
        if (room.participants.length === 0) {
          await this.redis.hdel(RedisTableName.GAME_ROOMS, roomId);
        } else {
          await this.redis.setTo(RedisTableName.GAME_ROOMS, roomId, room);
        }
      }

      // play-data
      const playData = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);

      if (playData) {
        delete playData.scores[String(userIdToRemove)];
        delete playData.totalScores[String(userIdToRemove)];

        if (Object.keys(playData.scores).length === 0) {
          await this.redis.hdel(RedisTableName.PLAY_DATA, roomId);
        } else {
          await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, playData);
        }
      }
    }
  }
}
