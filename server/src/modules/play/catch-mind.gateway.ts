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
import { v4 as uuid } from "uuid";
import { CatchMindGameRoom, CatchMindRecord } from "../../@types/catch-mind";

@UseFilters(new SocketBadRequestFilter("catch-mind/error"))
@UseFilters(SocketExceptionFilter)
@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class CatchMindGateway implements OnGatewayInit {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Catch Mind Gateway");
  readyPlayer: Map<string, string[]>;

  constructor(private prisma: PrismaService, private redis: RedisService, private catchMindService: CatchMindService) {
    this.readyPlayer = new Map();
  }

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

    const newRecord: CatchMindRecord = {
      gameId: 1,
      playId: uuid(),
      round: 1,
      answer,
      state: CatchMindState.WAIT,
      drawerIndex,
      scores,
      totalScores,
      forStart: room.participants.map(participant => participant.userId),
    };
    await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, newRecord);

    this.readyPlayer.set(newRecord.playId, []);

    // 룸 내의 모든 인원들이 전부 게임을 시작하게 만든다.
    this.server.to(roomId).emit("play/start");

    // 방에 라운드가 시작 됐음을 알린다
    // 유저들이 모두 인게임 페이지에 입장 후 round를 시작하도록 setTimeout 처리. 추후 더 일관성을 보장할 수 있는 로직으로 수정 필요.

    // setTimeout(() => {
    //   this.catchMindService.notifyRoundStart(this.server, roomId, room.participants, newRecord);
    // }, 500);

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

  @SubscribeMessage("catch-mind/rendered")
  async gameRendered(@ConnectedSocket() socket: Socket, @MessageBody() roomId: string) {
    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);

    const playData = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    this.readyPlayer.set(playData.playId, [...this.readyPlayer.get(playData.playId), socket.id]);

    if (this.readyPlayer.get(playData.playId).length === room.participants.length) {
      this.catchMindService.notifyRoundStart(this.server, roomId);
    }
  }

  @SubscribeMessage("play-room/exit")
  async exit(@ConnectedSocket() socket: Socket) {
    const user = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    if (!user || user.roomId === "lobby") return;

    const { roomId } = user;

    const playData: CatchMindRecord = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    if (!playData) return;
    // 게임이 끝나 로비로 돌아가는 경우는 무시

    const room: CatchMindGameRoom = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    if (!room) return;

    // drawerId 백업
    let drawerIndex = playData.drawerIndex;
    if (playData.state === CatchMindState.RESULT) {
      drawerIndex = (drawerIndex - 1 + room.participants.length) % room.participants.length;
    }
    const drawerId = room.participants[drawerIndex].userId;

    // 유저를 방에서 제거
    const { email } = user;

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

      if (room.participants.length === 0) {
        await this.redis.hdel(RedisTableName.PLAY_DATA, roomId);
      } else {
        await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, playData);
      }
    }

    // 유저가 drawer일 경우 방의 라운드 변경
    if (playData && drawerId === user.userId) {
      if (playData.state === CatchMindState.RESULT) {
        await this.redis.updateTo(RedisTableName.PLAY_DATA, roomId, { drawerIndex });
      } else {
        await this.redis.updateTo(RedisTableName.PLAY_DATA, roomId, {
          state: CatchMindState.DRAW,
          drawerIndex: playData.drawerIndex - 1,
        });
        this.catchMindService.notifyResultState(this.server, roomId, playData.playId, playData.round);
      }
    }

    // 유저를 로비로 보낸다
    socket.join("lobby");
    const userInfo = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    if (!userInfo) return;
    userInfo.roomId = "lobby";
    await this.redis.setTo(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, userInfo);

    // 유저가 나갔다는 소식을 방에 남게 될 모든 유저에게 전달
    socket.to(roomId).emit("game-room/info", {
      roomId,
      ...room,
    });
  }
}
