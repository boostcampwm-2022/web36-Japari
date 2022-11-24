import { Controller, ForbiddenException, Get, Param } from "@nestjs/common";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(private gameService: GameService) {}

  @Get("/info/:id")
  async getGame(@Param("id") id: string) {
    const gameId = Number(id);

    if (gameId === NaN) {
      throw new ForbiddenException();
    }
    const gameInfo = await this.gameService.findGame(gameId);

    return gameInfo;
  }

  @Get("/list")
  async getGameList() {
    const gameListInfo = await this.gameService.findAllGame();

    return gameListInfo;
  }
}
