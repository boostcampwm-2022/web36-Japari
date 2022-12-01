import { Inject, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import Redis from "ioredis";
import { Server, Socket } from "socket.io";
import { SERVER_SOCKET_PORT } from "src/constants/config";
import { RedisTableName } from "src/constants/redis-table-name";
import { redisRecordToObject } from "util/convert";

@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");

  constructor(@Inject("RedisProvider") private redis: Redis) {}

  afterInit(server: Server) {
    // 매 초마다 모든 유저들에게 접속 중인 유저 정보 전송
    setInterval(async () => {
      const records = await this.redis.hgetall(RedisTableName.ONLINE_USERS);

      const users = redisRecordToObject(records);

      server.emit("user/online", users);
    }, 1000);

    this.logger.verbose("user gateway initiated");
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
