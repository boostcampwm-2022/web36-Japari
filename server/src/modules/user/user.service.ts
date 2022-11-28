import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import Redis from "ioredis";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(id: number) {
    const userInfo = await this.prisma.user.findUnique({ where: { userId: id } });
    if (!userInfo) throw new NotFoundException();
    return userInfo;
  }

  async findAllUser() {
    return this.prisma.user.findMany();
  }
}
