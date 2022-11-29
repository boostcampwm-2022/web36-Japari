import { Controller } from "@nestjs/common";
import { GameRoomService } from "./game-room.service";

@Controller("game-room")
export class GameRoomController {
  constructor(private gameService: GameRoomService) {}
}
