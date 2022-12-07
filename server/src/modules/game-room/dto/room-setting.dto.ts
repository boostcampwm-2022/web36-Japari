import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class RoomSettingDto {
  @MinLength(1)
  @MaxLength(20)
  @IsString()
  title: string;

  @IsNumber()
  @Min(1)
  gameId: number;

  @IsNumber()
  @IsIn([4, 8])
  maximumPeople: number;

  @IsBoolean()
  isPrivate: boolean;

  @IsOptional()
  @IsString()
  password: string;
}
