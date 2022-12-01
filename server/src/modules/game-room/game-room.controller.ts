import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { GameRoomService } from "./game-room.service";

@Controller("gameroom")
export class GameRoomController {
  constructor(private gameService: GameRoomService) {}

  @Get("/:roomId")
  async getGameRoom(@Param("roomId") roomId: string) {
    return this.gameService.getRoomInfo(roomId);
  }
}
