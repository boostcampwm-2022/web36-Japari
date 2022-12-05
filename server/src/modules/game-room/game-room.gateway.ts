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
import { RedisTableName } from "src/constants/redis-table-name";
import { redisRecordToObject } from "util/convert";
import { PrismaService } from "../prisma/prisma.service";
import { v4 as uuid } from "uuid";
import { RoomSettingDto } from "./dto/room-setting.dto";
import { RoomCredentialDto } from "./dto/room-credential.dto";
import { SocketBadRequestFilter, SocketExceptionFilter } from "src/exception-filters/websocket.filter";
import { SocketException } from "src/constants/exception";
import { RedisService } from "../redis/redis.service";
import { SERVER_SOCKET_PORT } from "src/constants/config";

@UseFilters(new SocketBadRequestFilter("game-room/error"))
@UseFilters(SocketExceptionFilter)
@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class GameRoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");

  constructor(private redis: RedisService, private prisma: PrismaService) {}

  afterInit(server: Server) {
    // 매초마다 로비에 있는 유저들에게 방 목록을 전송
    setInterval(async () => {
      const records = await this.redis.hgetall(RedisTableName.GAME_ROOMS);

      const gameRooms = redisRecordToObject(records);
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

    // 입력으로 들어오지 않은 방 정보 추가
    const roomId = uuid();
    const { minimumPeople } = await this.prisma.game.findUnique({ where: { gameId } });

    // 새로운 방을 redis에 저장
    await this.redis.hset(
      RedisTableName.GAME_ROOMS,
      roomId,
      JSON.stringify({ title, gameId, maximumPeople, isPrivate, password, minimumPeople, participants: [] })
    );

    socket.emit("game-room/create-success", { roomId });
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("game-room/modify")
  async modify(@ConnectedSocket() socket: Socket, @MessageBody() data: RoomSettingDto) {
    const { roomId } = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
    const room = JSON.parse(await this.redis.hget(RedisTableName.GAME_ROOMS, roomId));
    const newRoom = { ...room, ...data };

    // 방 설정 변경
    this.redis.hset(RedisTableName.GAME_ROOMS, roomId, JSON.stringify(newRoom));

    // 방 설정 변경 사실을 방에 있는 모든 유저에게 전달
    this.server.to(roomId).emit("game-room/info", {
      roomId,
      ...newRoom,
    });
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("game-room/password")
  async checkPassword(@ConnectedSocket() socket, @MessageBody() data: RoomCredentialDto) {
    const { roomId, password } = data;

    const room = JSON.parse(await this.redis.hget(RedisTableName.GAME_ROOMS, roomId));

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

  @UsePipes(ValidationPipe)
  @SubscribeMessage("game-room/join")
  async join(@ConnectedSocket() socket, @MessageBody("roomId") roomId: string) {
    const room = JSON.parse(await this.redis.hget(RedisTableName.GAME_ROOMS, roomId));

    // 잘못된 room id 접근
    if (!room) {
      throw new SocketException("game-room/join-failed", "잘못된 room id 입니다.");
    }

    // 방 정원 초과
    if (room.participants.length + 1 > room.maximumPeople) {
      throw new SocketException("game-room/join-failed", "방 정원이 초과되었습니다.");
    }

    // 유저가 방에 추가되었다는 사실을 Redis에 저장
    const user = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
    room.participants.push(user);
    await this.redis.hset(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, JSON.stringify({ ...user, roomId }));
    await this.redis.hset(RedisTableName.GAME_ROOMS, roomId, JSON.stringify(room));

    socket.join(roomId);
    socket.leave("lobby");

    // 유저가 들어왔다는 소식을 참여한 유저와 기존에 방에 있던 모든 유저에게 전달
    this.server.to(roomId).emit("game-room/info", {
      roomId,
      ...room,
    });
  }

  @SubscribeMessage("game-room/exit")
  async exit(@ConnectedSocket() socket: Socket) {
    const { roomId } = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
    if (!roomId || roomId === "lobby") return;

    const room = JSON.parse(await this.redis.hget(RedisTableName.GAME_ROOMS, roomId));

    // 유저를 방에서 제거
    const { email } = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
    room.participants = room.participants.filter(user => user.email !== email);
    socket.leave(roomId);
    await this.redis.hset(RedisTableName.GAME_ROOMS, roomId, JSON.stringify(room));
    if (room.participants.length === 0) {
      this.redis.hdel(RedisTableName.GAME_ROOMS, roomId);
    }

    // 유저를 로비로 보낸다
    socket.join("lobby");
    const userInfo = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
    userInfo.roomId = "lobby";
    await this.redis.hset(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id, JSON.stringify(userInfo));

    // 유저가 나갔다는 소식을 방에 남게 될 모든 유저에게 전달
    socket.to(roomId).emit("game-room/info", {
      roomId,
      ...room,
    });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
