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
// import { RoomSettingDto } from "./dto/room-setting.dto";
// import { RoomCredentialDto } from "./dto/room-credential.dto";
import { SocketBadRequestFilter, SocketExceptionFilter } from "src/exception-filters/websocket.filter";
import { SocketException } from "src/constants/exception";
import { RedisService } from "../redis/redis.service";
import { SERVER_SOCKET_PORT } from "src/constants/config";
import { RoomCredentialDto } from "../game-room/dto/room-credential.dto";
import { RoomSettingDto } from "../game-room/dto/room-setting.dto";
import { CatchMindService } from "./catch-mind.service";
import { randFromArray, randInt } from "util/random";
import { ChatDto } from "../chat/chat.dto";

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
    const { roomId } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    const playData = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    if (playData) return; // 이미 게임 중일 경우 무시한다.

    // PLAY_DATA 테이블의 roomId 레코드를 초기화한다.
    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    const wordList = await this.prisma.catchMindWordList.findMany();
    const answer: string = randFromArray(wordList).word;
    const drawerId: number = randFromArray(room.participants).userId;
    const scores = room.participants.reduce((acc, cur) => {
      return { ...acc, [cur.userId]: 0 };
    }, {});
    const totalScores = { ...scores };

    const newRecord = {
      gameId: 1,
      round: 1,
      answer,
      state: CatchMindState.WAIT,
      drawerId,
      scores,
      totalScores,
    };
    await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, newRecord);

    this.catchMindService.notifyRoundStart(this.server, roomId, room.participants, newRecord);
  }

  @SubscribeMessage("catch-mind/image")
  async handleCatchMindImage(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const userInfo = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    console.log(data);
    console.log(userInfo);
    socket.to(userInfo.roomId).emit("catch-mind/image", data);
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
