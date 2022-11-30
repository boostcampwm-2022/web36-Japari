import { ArgumentsHost, BadRequestException, Catch, WsExceptionFilter } from "@nestjs/common";
import { WebsocketException } from "src/constants/exception";

@Catch(BadRequestException)
export class WebsocketBadRequestFilter implements WsExceptionFilter {
  constructor(private eventName: string) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const socket = ctx.getClient();
    socket.emit(this.eventName, (exception.getResponse() as any).message[0]);
  }
}

@Catch()
export class WebsocketExceptionFilter implements WsExceptionFilter {
  catch(exception: WebsocketException, host: ArgumentsHost) {
    if (host.getType() !== "ws") return;

    const ctx = host.switchToWs();
    const socket = ctx.getClient();
    socket.emit(exception.eventName, exception.message);
  }
}
