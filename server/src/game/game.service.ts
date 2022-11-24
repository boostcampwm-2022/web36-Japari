import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async getGame(id: number) {
    return this.prisma.game.findUnique({ where: { game_id: id } });
  }
}
