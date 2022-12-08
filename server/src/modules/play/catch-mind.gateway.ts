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

    // 룸 내의 다른 인원들이 전부 게임을 시작하게 만든다.
    socket.to(roomId).emit("play/start");

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

    // 방에 라운드가 시작 됐음을 알린다
    this.catchMindService.notifyRoundStart(this.server, roomId, room.participants, newRecord);
  }

  @SubscribeMessage("catch-mind/image")
  async handleCatchMindImage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const { round, imageSrc } = data;
    const { roomId } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    socket.to(roomId).emit("catch-mind/image", { round, imageSrc });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
