import { Controller, ForbiddenException, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(private gameService: GameService) {}

  @Get("/list")
  async getGameList() {
    return this.gameService.findAllGame();
  }

  @Get("/:gameId")
  async getGame(@Param("gameId", ParseIntPipe) gameId: number) {
    return this.gameService.findGame(gameId);
  }
}
