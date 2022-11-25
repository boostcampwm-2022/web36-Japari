import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async findGame(id: number) {
    let gameInfo = await this.prisma.game.findUnique({ where: { gameId: id } });
    if (!gameInfo) gameInfo = { gameId: 0, name: "", minimumPeople: 0 };

    return gameInfo;
  }

  async findAllGame() {
    let gameList = await this.prisma.game.findMany();
    if (!gameList) gameList = [];

    return gameList;
  }
}
