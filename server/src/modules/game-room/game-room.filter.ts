import { Catch, BadRequestException, ExceptionFilter, ArgumentsHost } from "@nestjs/common";

@Catch(BadRequestException)
export class RoomSettingValidationExceptionFilter implements ExceptionFilter<BadRequestException> {
  constructor(private eventName: string) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    if (host.getType() !== "ws") throw exception;
    const ctx = host.switchToWs();
    const socket = ctx.getClient();

    const httpErrorMessage = (exception.getResponse() as any).message[0];
    console.log(httpErrorMessage);

    let errorMessage;
    if (/^title/.test(httpErrorMessage)) {
      errorMessage = "방 제목은 1자 이상 20자 이하여야만 합니다.";
    } else if (/^password/.test(httpErrorMessage)) {
      errorMessage = "비밀번호는 1자 이상 20자 이하여야만 합니다.";
    } else if (/^gameId/.test(httpErrorMessage)) {
      errorMessage = "게임을 선택해주세요.";
    } else if (/^maximumPeople/.test(httpErrorMessage)) {
      errorMessage = "최대 인원을 선택해주세요.";
    }

    socket.emit(this.eventName, errorMessage);
  }
}
