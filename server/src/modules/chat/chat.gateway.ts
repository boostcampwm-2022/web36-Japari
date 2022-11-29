import { Inject, Logger, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
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
import { PrismaService } from "../prisma/prisma.service";

@WebSocketGateway(4001, { transports: ["websocket"], namespace: "/" })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");

  constructor(private jwt: JwtService, private prisma: PrismaService, @Inject("RedisProvider") private redis: Redis) {}

  @SubscribeMessage("chat/lobby")
  async handleLobbyChat(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    const { message, sendTime } = data;
    // receive 확인
    this.logger.verbose(data);
    console.dir(message);
    const sender = (await this.redis.hmget("socket-id-to-user-name", socket.id))[0];

    socket.to("lobby").emit("chat/lobby", {
      sender,
      message,
      sendTime,
    });
  }

  @SubscribeMessage("chat/room")
  async handleRoomChat(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    const { message, sendTime } = data;
    const sender = (await this.redis.hmget("socket-id-to-user-name", socket.id))[0];
    const room = (await this.redis.hmget("socket-id-to-room-id"))[0];

    socket.to(room).emit("chat/room", {
      sender,
      message,
      sendTime,
    });
  }

  afterInit(server: Server) {
    this.logger.verbose("chat gateway initiated");
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
