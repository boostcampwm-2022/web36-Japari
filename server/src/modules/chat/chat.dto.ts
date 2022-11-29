import { IsString } from "class-validator";

export class ChatDto {
  @IsString()
  message: string;

  @IsString()
  sendTime: string;
}
