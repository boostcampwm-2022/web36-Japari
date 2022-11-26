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

@WebSocketGateway({ transports: ["websocket"], namespace: "" })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;

  /*
    추후 추가하면 좋을 것들
    1. AccessTokenGuard를 건다
    2. connection시 socket.id와 user.id를 매핑한다
    3. userService를 가져온다
    4. chat이 들어오면 socket.id를 기반으로 sender를 파악한다. 
  */

  @SubscribeMessage("chat/lobby")
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data) {
    // const { sender, message } = data;
    socket.broadcast.emit("chat/lobby", data);
  }

  afterInit(server: Server) {
    console.log("web socket server initiated");
  }

  handleConnection(@ConnectedSocket() socket: Socket) {
    // console.log("chat/connection", socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    // console.log("chat/disconnection", socket.nsp.name);
  }
}
