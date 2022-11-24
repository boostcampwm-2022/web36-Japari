import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async findGame(id: number) {
    let gameInfo = await this.prisma.game.findUnique({ where: { game_id: id } });
    if (!gameInfo) gameInfo = { game_id: 0, name: "", minimum_people: 0 };

    return gameInfo;
  }

  async findAllGame() {
    let gameList = await this.prisma.game.findMany();
    if (!gameList) gameList = [];

    return gameList;
  }
}
