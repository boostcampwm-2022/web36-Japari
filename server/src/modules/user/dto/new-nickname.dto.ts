import { IsString } from "class-validator";

export class NewNickName {
  @IsString()
  nickname: string;
}
