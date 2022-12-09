import { Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
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
import { Server, Socket } from "socket.io";
import { CatchMindState, RedisTableName } from "src/constants/enum";
import { PrismaService } from "../prisma/prisma.service";
import { SocketBadRequestFilter, SocketExceptionFilter } from "src/exception-filters/websocket.filter";
import { RedisService } from "../redis/redis.service";
import { SERVER_SOCKET_PORT } from "src/constants/config";

import { CatchMindService } from "./catch-mind.service";
import { randFromArray } from "util/random";

export interface CatchMindRecord {
  gameId: number;
  answer: string;
  round: number;
  state: CatchMindState;
  drawerIndex: number;
  scores: Record<string, number>;
  totalScores: Record<string, number>;
}

@UseFilters(new SocketBadRequestFilter("catch-mind/error"))
@UseFilters(SocketExceptionFilter)
@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class CatchMindGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Catch Mind Gateway");

  constructor(private prisma: PrismaService, private redis: RedisService, private catchMindService: CatchMindService) {}

  afterInit(server: Server) {
    this.logger.verbose("catch mind gateway initiated");
  }

  @SubscribeMessage("catch-mind/start")
  async start(@ConnectedSocket() socket: Socket) {
    // 이미 게임 중일 경우 요청을 무시한다.
    const { roomId } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    const playData = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    if (playData) return;

    // PLAY_DATA 테이블의 roomId 레코드를 초기화한다.
    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    const wordList = await this.prisma.catchMindWordList.findMany();
    const answer: string = randFromArray(wordList).word;
    const drawerIndex = 0;

    const scores = room.participants.reduce((acc, cur) => {
      return { ...acc, [cur.userId]: 0 };
    }, {});
    const totalScores = { ...scores };

    const newRecord = {
      gameId: 1,
      round: 1,
      answer,
      state: CatchMindState.WAIT,
      drawerIndex,
      scores,
      totalScores,
    } as CatchMindRecord;
    await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, newRecord);

    // 룸 내의 모든 인원들이 전부 게임을 시작하게 만든다.
    this.server.to(roomId).emit("play/start");

    // 방에 라운드가 시작 됐음을 알린다
    // 유저들이 모두 인게임 페이지에 입장 후 round를 시작하도록 setTimeout 처리. 추후 더 일관성을 보장할 수 있는 로직으로 수정 필요.
    setTimeout(() => {
      this.catchMindService.notifyRoundStart(this.server, roomId, room.participants, newRecord);
    }, 500);
    return;
  }

  @SubscribeMessage("catch-mind/image")
  async handleCatchMindImage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const { round, imageSrc } = data;
    const { roomId } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    socket.to(roomId).emit("catch-mind/image", { round, imageSrc });
  }

  @SubscribeMessage("play-room/enter")
  async enter(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    if (!room) return { room, ids: [] };

    const ids = room.participants.map(participant => participant.userId);

    return { room, ids };
  }

  @SubscribeMessage("play-room/exit")
  async exit(@ConnectedSocket() socket: Socket) {
    const user = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    if (!user || user.roomId === "lobby") return;

    const { roomId } = user;

    const playData = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    if (!playData) return;
    // 게임이 끝나 로비로 돌아가는 경우는 무시

    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);

    // 유저를 방에서 제거
    const { email } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    room.participants = room.participants.filter(user => user.email !== email);
    socket.leave(roomId);
    await this.redis.setTo(RedisTableName.GAME_ROOMS, roomId, room);
    if (room.participants.length === 0) {
      this.redis.hdel(RedisTableName.GAME_ROOMS, roomId);
    }

    // 유저를 PlayData에서 제거

    if (playData) {
      delete playData.scores[String(user.userId)];
      delete playData.totalScores[String(user.userId)];

      if (Object.keys(playData.scores).length === 0) {
        await this.redis.hdel(RedisTableName.PLAY_DATA, roomId);
      } else {
        await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, playData);
      }
    }

    // 유저를 로비로 보낸다
    socket.join("lobby");
    const userInfo = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    userInfo.roomId = "lobby";
    await this.redis.setTo(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, userInfo);

    // 유저가 나갔다는 소식을 방에 남게 될 모든 유저에게 전달
    socket.to(roomId).emit("game-room/info", {
      roomId,
      ...room,
    });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
