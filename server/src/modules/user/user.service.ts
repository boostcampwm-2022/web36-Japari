import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/modules/prisma/prisma.service";

const getUserOption = {
  userId: true,
  email: true,
  nickname: true,
  score: true,
  profileImage: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUser(id: number) {
    const userInfo = await this.prisma.user.findUnique({
      where: { userId: id },
      select: getUserOption,
    });
    if (!userInfo) throw new NotFoundException();
    return userInfo;
  }

  async findAllUser() {
    return this.prisma.user.findMany({ select: getUserOption });
  }

  async updateUserNickname(userId: number, nickname: string) {
    return this.prisma.user.update({
      where: { userId },
      data: { nickname },
    });
  }

  async updateUserProfileImage(userId: number, profileImage: string) {
    return this.prisma.user.update({
      where: { userId },
      data: { profileImage },
    });
  }
}
