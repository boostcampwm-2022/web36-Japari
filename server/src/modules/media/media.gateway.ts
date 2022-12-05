import { Inject, Logger, UseFilters } from "@nestjs/common";
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
import { WebsocketBadRequestFilter } from "src/exception-filters/websocket.filter";

@UseFilters(new WebsocketBadRequestFilter("media/error"))
@WebSocketGateway(4001, { transports: ["websocket"], namespace: "/" })
export class MediaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Media Gateway");

  constructor(@Inject("RedisProvider") private redis: Redis) {}

  afterInit(server: Server) {
    this.logger.verbose("media gateway initiated");
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
