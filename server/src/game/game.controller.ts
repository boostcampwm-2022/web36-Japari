import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { GameService } from "./game.service";

@Controller("game")
export class AuthController {
  constructor(private gameService: GameService) {}

  @Get("/info/:id")
  async login(@Res() res: Response, @Param("id") id: string) {
    if (Number(id) == NaN) {
      return res.status(403).send({ message: "invalid data" });
    }
    const gameInfo = this.gameService.getGame(Number(id));

    return res.status(200).send(gameInfo);
  }
}
