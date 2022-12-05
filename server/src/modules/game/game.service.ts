import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async findGame(id: number) {
    const gameInfo = await this.prisma.game.findUnique({ where: { gameId: id } });
    if (!gameInfo) throw new NotFoundException();
    return gameInfo;
  }

  async findAllGame() {
    return this.prisma.game.findMany();
  }
}
