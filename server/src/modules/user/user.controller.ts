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
import { Request } from "express";
import { JwtGuard } from "../auth/jwt/jwt.guard";
import { NewNickName } from "./dto/new-nickname.dto";
import { NewProfileImage } from "./dto/new-profile-image.dto";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/")
  async getLoggedInUser(@Req() req: Request) {
    return this.userService.findUser(req.user.userId);
  }

  @Get("/top")
  async getTopUsers() {
    return this.userService.findTopTenUser();
  }

  @UsePipes(ValidationPipe)
  @Patch("/nickname")
  async patchNickname(@Req() req: Request, @Body() { nickname }: NewNickName) {
    return this.userService.updateUserNickname(req.user.userId, nickname);
  }

  @UsePipes(ValidationPipe)
  @Patch("/profile-image")
  async patchProfile(@Req() req: Request, @Body() { profileImage }: NewProfileImage) {
    return this.userService.updateUserProfileImage(req.user.userId, profileImage);
  }

  @Get("/:id")
  async getUser(@Param("id", ParseIntPipe) userId: number) {
    return this.userService.findUser(userId);
  }
}
