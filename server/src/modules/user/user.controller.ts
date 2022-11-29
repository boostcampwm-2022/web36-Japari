import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { RequestWithUser } from "express";
import { AccessTokenGuard } from "../jwt/jwt-access-token.guard";
import { NewNickName } from "./dto/new-nickname.dto";
import { NewProfileImage } from "./dto/new-profile-image.dto";
import { UserService } from "./user.service";

@UseGuards(AccessTokenGuard)
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/")
  async getLoggedInUser(@Req() req: RequestWithUser) {
    return this.userService.findUser(req.user.userId);
  }

  @Get("/list")
  async getUserList() {
    return this.userService.findAllUser();
  }

  @UsePipes(ValidationPipe)
  @Patch("/nickname")
  async patchNickname(@Req() req: RequestWithUser, @Body() { nickname }: NewNickName) {
    return this.userService.updateUserNickname(req.user.userId, nickname);
  }

  @UsePipes(ValidationPipe)
  @Patch("/profile-image")
  async patchProfile(@Req() req: RequestWithUser, @Body() { profileImage }: NewProfileImage) {
    return this.userService.updateUserProfileImage(req.user.userId, profileImage);
  }

  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findUser(userId);
  }
}
