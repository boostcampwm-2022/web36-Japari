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

    // 랭킹을 구한다.
    const rank =
      (await this.prisma.user.count({
        where: {
          score: {
            gt: userInfo.score,
          },
        },
      })) + 1;

    return { ...userInfo, rank };
  }

  async findTopTenUser() {
    const promises = [];
    const topUsers = await this.prisma.user.findMany({ select: getUserOption, orderBy: { score: "desc" }, take: 10 });
    topUsers.forEach(user => {
      promises.push(this.redis.getFrom(RedisTableName.ONLINE_USERS, String(user.userId)));
    });
    const onlineTopUsers = await Promise.all(promises);
    return topUsers.map((topUser, index) => {
      if (onlineTopUsers[index]) {
        return { ...topUser, connected: true };
      }
      return { ...topUser, connected: false };
    });
  }

  async updateUserNickname(userId: number, nickname: string) {
    const { socketId } = await this.redis.getFrom(RedisTableName.ONLINE_USERS, String(userId));
    await this.redis.updateTo(RedisTableName.ONLINE_USERS, String(userId), { nickname });
    await this.redis.updateTo(RedisTableName.SOCKET_ID_TO_USER_INFO, socketId, { nickname });
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
