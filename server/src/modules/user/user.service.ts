import { Injectable, NotFoundException } from "@nestjs/common";
import { RedisTableName } from "src/constants/enum";
import { PrismaService } from "src/modules/prisma/prisma.service";
import { RedisService } from "../redis/redis.service";

const getUserOption = {
  userId: true,
  email: true,
  nickname: true,
  score: true,
  profileImage: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private redis: RedisService) {}

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
    const userInfo = JSON.parse(await this.redis.hget(RedisTableName.ONLINE_USERS, String(userId)));
    userInfo.nickname = nickname;
    await this.redis.hset(RedisTableName.ONLINE_USERS, userId, JSON.stringify(userInfo));
    await this.redis.hset(RedisTableName.SOCKET_ID_TO_USER_INFO, userInfo.socketId, JSON.stringify(userInfo));
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
