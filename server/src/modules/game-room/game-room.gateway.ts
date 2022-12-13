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
import { RedisTableName } from "src/constants/enum";
import { redisRecordToObject } from "util/convert";
import { PrismaService } from "../prisma/prisma.service";
import { v4 as uuid } from "uuid";
import { RoomSettingDto } from "./dto/room-setting.dto";
import { RoomCredentialDto } from "./dto/room-credential.dto";
import { SocketExceptionFilter } from "src/exception-filters/websocket.filter";
import { SocketException } from "src/constants/exception";
import { RedisService } from "../redis/redis.service";
import { SERVER_SOCKET_PORT } from "src/constants/config";
import { RoomSettingValidationExceptionFilter } from "./game-room.filter";
import { CatchMindGameRoom } from "src/@types/catch-mind";

@UseFilters(new RoomSettingValidationExceptionFilter("game-room/error"))
@UseFilters(SocketExceptionFilter)
@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class GameRoomGateway implements OnGatewayInit {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Game Room Gateway");

  constructor(private redis: RedisService, private prisma: PrismaService) {}

  afterInit(server: Server) {
    // 매초마다 로비에 있는 유저들에게 방 목록을 전송
    setInterval(async () => {
      const gameRoomsRecords = await this.redis.hgetall(RedisTableName.GAME_ROOMS);
      const playDataRecords = await this.redis.hgetall(RedisTableName.PLAY_DATA);

      const gameRooms = redisRecordToObject(gameRoomsRecords);
      const playData = redisRecordToObject(playDataRecords);

      // 게임중인 방은 목록에서 제외
      Object.keys(playData).forEach(key => delete gameRooms[key]);

      // 방 정보를 data에 담아서 전송
      let data = [];
      for (let roomId in gameRooms) {
        const { title, gameId, participants, maximumPeople, isPrivate } = gameRooms[roomId];

        data.push({
          roomId,
          title,
          gameId: Number(gameId),
          currentPeople: participants.length,
          maximumPeople,
          isPrivate,
        });
      }

      server.to("lobby").emit("game-room/list", data);
    }, 1000);

    this.logger.verbose("game room gateway initiated");
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("game-room/create")
  async create(@ConnectedSocket() socket: Socket, @MessageBody() data: RoomSettingDto) {
    const { title, gameId, maximumPeople, isPrivate, password } = data;

    if (isPrivate && !(password.length >= 1 && password.length <= 20)) {
      throw new SocketException("game-room/error", "비밀번호는 1자 이상 20자 이하여야만 합니다.");
    }

    // 입력으로 들어오지 않은 방 정보 추가
    const roomId = uuid();
    const { minimumPeople } = await this.prisma.game.findUnique({ where: { gameId } });

    // 새로운 방을 redis에 저장
    await this.redis.setTo(RedisTableName.GAME_ROOMS, roomId, {
      title,
      gameId,
      maximumPeople,
      isPrivate,
      password,
      minimumPeople,
      participants: [],
    });

    socket.emit("game-room/create-success", { roomId });
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("game-room/modify")
  async modify(@ConnectedSocket() socket: Socket, @MessageBody() data: RoomSettingDto) {
    const { isPrivate, password } = data;

    if (isPrivate && !(password.length >= 1 && password.length <= 20)) {
      throw new SocketException("game-room/error", "비밀번호는 1자 이상 20자 이하여야만 합니다.");
    }

    const user = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    if (!user) return;
    const { roomId } = user;
    if (!roomId) return;
    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    if (!room) return;
    const newRoom = { ...room, ...data };

    // 방 설정 변경
    this.redis.setTo(RedisTableName.GAME_ROOMS, roomId, newRoom);

    // 방 설정 변경 사실을 방에 있는 모든 유저에게 전달
    this.server.to(roomId).emit("game-room/info", {
      roomId,
      ...newRoom,
    });

    socket.emit("game-room/modify-success", { roomId });
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("game-room/password")
  async checkPassword(@ConnectedSocket() socket, @MessageBody() data: RoomCredentialDto) {
    const { roomId, password } = data;

    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);

    // 잘못된 room id
    if (!room) {
      throw new SocketException("game-room/password-failed", "잘못된 room id 입니다.");
    }

    // 잘못된 비밀번호 입력
    if (room.isPrivate && room.password !== password) {
      throw new SocketException("game-room/password-failed", "잘못된 비밀번호입니다.");
    }

    // 패스워드를 올바르게 입력했다고 응답
    socket.emit("game-room/password-success", {
      roomId,
    });
  }

  // 방에 입장
  @UsePipes(ValidationPipe)
  @SubscribeMessage("game-room/join")
  async join(@ConnectedSocket() socket, @MessageBody("roomId") roomId: string) {
    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    // 잘못된 room id 접근
    if (!room) {
      throw new SocketException("game-room/join-failed", "잘못된 room id 입니다.");
    }

    const playData = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    // 이미 시작한 게임 방 접근
    if (playData) {
      throw new SocketException("game-room/join-failed", "이미 시작한 게임 방입니다.");
    }

    const { userId } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    const alreadyJoined = room.participants.map(user => user.userId).includes(userId);

    // 방 정원 초과
    if (room.participants.length + 1 > room.maximumPeople) {
      throw new SocketException("game-room/join-failed", "방 정원이 초과되었습니다.");
    }

    // 소켓 - roomId 매핑
    await this.redis.updateTo(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, { roomId });

    // 소켓 룸 변경
    socket.join(roomId);
    socket.leave("lobby");

    // 게임 방 정보 갱신
    if (!alreadyJoined) {
      const user = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
      room.participants.push({ ...user, socketId: socket.id });
      await this.redis.setTo(RedisTableName.GAME_ROOMS, roomId, room);
    }

    // 유저가 들어왔다는 소식을 참여한 유저와 기존에 방에 있던 모든 유저에게 전달
    this.server.to(roomId).emit("game-room/info", {
      roomId,
      ...room,
    });
  }

  @SubscribeMessage("wait-room/exit")
  async exit(@ConnectedSocket() socket: Socket) {
    const user = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    if (!user || user.roomId === "lobby") return;

    const { roomId } = user;
    const playData = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    if (playData) return;
    // play 중이면 취소 (playing 페이지로 넘어간 경우)

    const room: CatchMindGameRoom = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    if (!room) return;

    // 유저를 방에서 제거
    const { userId } = user;
    room.participants = room.participants.filter(user => user.userId !== userId);
    socket.leave(roomId);
    await this.redis.setTo(RedisTableName.GAME_ROOMS, roomId, room);
    if (room.participants.length === 0) {
      this.redis.hdel(RedisTableName.GAME_ROOMS, roomId);
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
}
