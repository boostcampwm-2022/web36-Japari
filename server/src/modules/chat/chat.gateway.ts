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
import { SERVER_SOCKET_PORT } from "src/constants/config";
import { CatchMindState, RedisTableName } from "src/constants/enum";
import { SocketBadRequestFilter } from "src/exception-filters/websocket.filter";
import { CatchMindService } from "../play/catch-mind.service";
import { RedisService } from "../redis/redis.service";
import { ChatDto } from "./chat.dto";

@UseFilters(new SocketBadRequestFilter("chat/error"))
@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");

  constructor(private redis: RedisService, private catchMindService: CatchMindService) {}

  afterInit(server: Server) {
    this.logger.verbose("chat gateway initiated");
  }

  @UsePipes(ValidationPipe)
  @SubscribeMessage("chat/lobby")
  async handleLobbyChat(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatDto) {
    const { message, sendTime } = data;
    const userInfo = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
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

    // 캐치마인드 그리기 중일 경우 catchMindService에 처리를 위임한다.
    if (await this.catchMindService.isDrawing(socket)) {
      await this.catchMindService.judge(socket, this.server, message, sendTime);
      return;
    }

    const userInfo = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);

    socket.to(userInfo.roomId).emit("chat/room", {
      sender: userInfo.nickname,
      message,
      sendTime,
    });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
