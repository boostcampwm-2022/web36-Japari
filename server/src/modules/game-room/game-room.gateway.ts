import { Inject, Logger } from "@nestjs/common";
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
import Redis from "ioredis";
import { Server, Socket } from "socket.io";
import { RedisTableName } from "src/constants/redis-table-name";
import { redisRecordToObject } from "util/convert";
import { PrismaService } from "../prisma/prisma.service";
import { v4 as uuid } from "uuid";
import { getRoomId } from "util/socket";

@WebSocketGateway(4001, { transports: ["websocket"], namespace: "/" })
export class GameroomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");

  constructor(@Inject("RedisProvider") private redis: Redis, private prisma: PrismaService) {}

  afterInit(server: Server) {
    // 매초마다 로비에 있는 유저들에게 방 목록을 전송
    setInterval(async () => {
      const records = await this.redis.hgetall(RedisTableName.GAME_ROOMS);

      const gameRooms = redisRecordToObject(records);

      server.to("lobby").emit("game-room/list", gameRooms);
    }, 1000);

    this.logger.verbose("game room gateway initiated");
  }

  @SubscribeMessage("game-room/create")
  async create(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    const { title, gameId, maximumPeople, isPrivate, password } = data;

    // 입력으로 들어오지 않은 방 정보 추가
    const roomId = uuid();
    const { minimumPeople } = await this.prisma.game.findUnique({ where: { gameId } });

    // 새로운 방을 redis에 저장
    this.redis.hset(
      RedisTableName.GAME_ROOMS,
      roomId,
      JSON.stringify({ title, gameId, maximumPeople, isPrivate, password, minimumPeople, participants: [] })
    );

    // 방 생성자 방에 입장
    this.join(socket, { roomId, password });
  }

  @SubscribeMessage("game-room/modify")
  async modify(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    const roomId = getRoomId(socket);
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

  @SubscribeMessage("game-room/join")
  async join(@ConnectedSocket() socket, @MessageBody() data) {
    const { roomId, password } = data;

    const room = JSON.parse(await this.redis.hget(RedisTableName.GAME_ROOMS, roomId));

    if (!room) {
      socket.emit("game-room/join-failed", {
        message: "the room does not exist",
      });
      return;
    }

    // 잘못된 비밀번호 입력
    if (room.isPrivate && room.password !== password) {
      socket.emit("game-room/join-failed", {
        message: "wrong password",
      });
      return;
    }

    // 방 정원 초과
    if (room.participants.length + 1 > room.maximumPeople) {
      socket.emit("game-room/join-failed", {
        message: "the room is full",
      });
      return;
    }

    // 유저를 방에 추가
    const user = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
    room.participants.push(user);
    socket.join(roomId);
    socket.leave("lobby");
    this.redis.hset(RedisTableName.GAME_ROOMS, roomId, JSON.stringify(room));

    // 유저가 들어왔다는 소식을 참여한 유저와 기존에 방에 있던 모든 유저에게 전달
    this.server.to(roomId).emit("game-room/info", {
      roomId,
      ...room,
    });
  }

  @SubscribeMessage("game-room/exit")
  async exit(@ConnectedSocket() socket: Socket) {
    const roomId = getRoomId(socket);
    if (roomId === "lobby") return;
    const room = JSON.parse(await this.redis.hget(RedisTableName.GAME_ROOMS, roomId));

    // 유저를 방에서 제거
    const { email } = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
    room.participants = room.participants.filter(user => user.email !== email);
    socket.leave(roomId);
    socket.join("lobby");
    this.redis.hset(RedisTableName.GAME_ROOMS, roomId, JSON.stringify(room));

    if (room.participants.length === 0) {
      this.redis.hdel(RedisTableName.GAME_ROOMS, roomId);
    }

    // 유저가 나갔다는 소식을 방에 남게 될 모든 유저에게 전달
    socket.to(roomId).emit("game-room/info", {
      roomId,
      ...room,
    });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
