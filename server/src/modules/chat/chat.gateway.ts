import { Inject, Logger, UsePipes, ValidationPipe } from "@nestjs/common";
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
import { ChatDto } from "./chat.dto";

@WebSocketGateway(4001, { transports: ["websocket"], namespace: "/" })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");

  constructor(@Inject("RedisProvider") private redis: Redis) {}

  afterInit(server: Server) {
    this.logger.verbose("chat gateway initiated");
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("chat/lobby")
  async handleLobbyChat(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatDto) {
    const { message, sendTime } = data;
    const userInfo = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));

    console.log(userInfo);

    socket.to("lobby").emit("chat/lobby", {
      sender: userInfo.nickname,
      message,
      sendTime,
    });
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("chat/room")
  async handleRoomChat(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatDto) {
    const { message, sendTime } = data;
    const userInfo = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));

    socket.to(userInfo.roomId).emit("chat/room", {
      sender: userInfo.nickname,
      message,
      sendTime,
    });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
