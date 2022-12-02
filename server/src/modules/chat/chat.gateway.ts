import { Inject, Logger, UseFilters, UsePipes, ValidationPipe } from "@nestjs/common";
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
import { SERVER_SOCKET_PORT } from "src/constants/config";
import { RedisTableName } from "src/constants/redis-table-name";
import { WebsocketBadRequestFilter } from "src/exception-filters/websocket.filter";
import { RedisService } from "../redis/redis.service";
import { ChatDto } from "./chat.dto";

@UseFilters(new WebsocketBadRequestFilter("chat/error"))
@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");

  constructor(private redis: RedisService) {}

  afterInit(server: Server) {
    this.logger.verbose("chat gateway initiated");
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("chat/lobby")
  async handleLobbyChat(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatDto) {
    const { message, sendTime } = data;
    const userInfo = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id));
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
