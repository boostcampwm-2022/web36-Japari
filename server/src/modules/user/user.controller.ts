import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("/list")
  async getUserList() {
    return this.userService.findAllUser();
  }

  @Get("/:userId")
  async getUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.userService.findUser(userId);
  }
}
