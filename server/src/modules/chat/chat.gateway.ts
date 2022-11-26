import { Logger, UseGuards } from "@nestjs/common";
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
import { Server, Socket } from "socket.io";
import { PrismaService } from "../prisma/prisma.service";

@WebSocketGateway({ transports: ["websocket"], namespace: "" })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Chat Gateway");
  private socketIdToUserEmail = new Map<string, string>(); // 모킹을 위해 이름 대신 email 저장

  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  @SubscribeMessage("chat/lobby")
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() message) {
    socket.broadcast.emit("chat/lobby", { senderEmail: this.socketIdToUserEmail.get(socket.id), message });
  }

  afterInit(server: Server) {
    this.logger.verbose("chat gateway initiated");
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    const jwtAccessToken = socket.handshake.query["jwt-access-token"] as string;

    try {
      const payload = this.jwt.verify(jwtAccessToken);
      const { userId } = payload;

      const user = await this.prisma.user.findUnique({
        where: { userId },
      });

      this.socketIdToUserEmail.set(socket.id, user.email);
    } catch (e) {
      socket.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    // console.log("chat/disconnection", socket.nsp.name);
  }
}
