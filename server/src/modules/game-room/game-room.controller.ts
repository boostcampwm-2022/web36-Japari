import { Controller, ForbiddenException, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GameRoomService } from "./game-room.service";

@Controller("game")
export class GameRoomController {
  constructor(private gameService: GameRoomService) {}
}
