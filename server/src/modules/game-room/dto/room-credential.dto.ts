import { IsString, IsOptional } from "class-validator";

export class RoomCredentialDto {
  @IsString()
  roomId: string;

  @IsOptional()
  @IsString()
  password: string;
}
