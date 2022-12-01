import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class RoomSettingDto {
  @IsString()
  title: string;

  @IsNumber()
  gameId: number;

  @IsNumber()
  maximumPeople: number;

  @IsBoolean()
  isPrivate: boolean;

  @IsOptional()
  @IsString()
  password: string;
}
