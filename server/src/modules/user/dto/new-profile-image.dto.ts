import { IsString } from "class-validator";

export class NewProfileImage {
  @IsString()
  profileImage: string;
}
