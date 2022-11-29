import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GameService } from "./game.service";

@Controller("game")
export class GameController {
  constructor(private gameService: GameService) {}

  @Get("/list")
  async getGameList() {
    return this.gameService.findAllGame();
  }

  @Get("/:game-id")
  async getGame(@Param("game-id", ParseIntPipe) gameId: number) {
    return this.gameService.findGame(gameId);
  }
}
