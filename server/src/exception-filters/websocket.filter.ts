import { ArgumentsHost, BadRequestException, Catch } from "@nestjs/common";
import { SocketException } from "src/constants/exception";

@Catch(BadRequestException)
export class SocketBadRequestFilter {
  constructor(private eventName: string) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    if (host.getType() !== "ws") throw exception;
    const ctx = host.switchToWs();
    const socket = ctx.getClient();
    socket.emit(this.eventName, (exception.getResponse() as any).message[0]);
  }
}

@Catch()
export class SocketExceptionFilter {
  catch(exception: SocketException, host: ArgumentsHost) {
    if (host.getType() !== "ws") throw exception;
    const ctx = host.switchToWs();
    const socket = ctx.getClient();
    socket.emit(exception.eventName, exception.message);
  }
}
