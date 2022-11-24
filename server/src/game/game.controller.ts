import { Controller, Get, Param, Query, Res } from "@nestjs/common";
import { Response } from "express";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(private gameService: GameService) {}

  @Get("/info/:id")
  async getGame(@Res() res: Response, @Param("id") id: string) {
    if (Number(id) == NaN) {
      return res.status(403).send({ message: "invalid data" });
    }
    const gameInfo = await this.gameService.findGame(Number(id));

    return res.status(200).send(gameInfo);
  }

  @Get("/list")
  async getGameList(@Res() res: Response) {
    const gameListInfo = await this.gameService.findAllGame();

    return res.status(200).send(gameListInfo);
  }
}
