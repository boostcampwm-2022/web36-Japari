import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { RequestWithAccessToken } from "express";
import { AccessTokenGuard } from "../jwt/jwt-access-token.guard";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Get("/")
  async getLoggedInUser(@Req() req: RequestWithAccessToken) {
    return this.userService.findUser(req.user.userId);
  }

  @UseGuards(AccessTokenGuard)
  @Get("/list")
  async getUserList() {
    return this.userService.findAllUser();
  }

  @UseGuards(AccessTokenGuard)
  @Get("/:userId")
  async getUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.findUser(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch("/nickname/:userId")
  async patchNickname(
    @Param("userId", ParseIntPipe) userId: number,
    @Req() req: RequestWithAccessToken,
    @Body() { nickname }: { nickname: string }
  ) {
    if (req.user.userId != userId) throw new UnauthorizedException();
    return this.userService.updateUserNickname(userId, nickname);
  }
}
