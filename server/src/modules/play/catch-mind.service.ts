import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { CatchMindState, RedisTableName } from "src/constants/enum";
import { randFromArray } from "util/random";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class CatchMindService {
  private logger = new Logger("Catch Mind Service");
  constructor(private redis: RedisService, private prisma: PrismaService) {}

  async notifyRoundStart(server: Server, roomId: string, participants: any[], record: any) {
    const { drawerId, round, scores, totalScores, answer } = record;
    participants.forEach(({ userId, socketId }) => {
      const resp = {
        round,
        drawerId,
        scores,
        totalScores,
      };

      if (userId != drawerId) {
        server.to(socketId).emit("catch-mind/round-start", resp);
        return;
      }

      // 그릴 사람에게는 정답도 알려준다.
      server.to(socketId).emit("catch-mind/round-start", { ...resp, answer });
    });

    // 10초 뒤 draw state start
    setTimeout(() => {
      this.notifyDrawState(server, roomId);
    }, 10 * 1000);
  }

  async notifyDrawState(server: Server, roomId: string) {
    const record = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, { ...record, state: CatchMindState.DRAW });
    server.to(roomId).emit("catch-mind/draw-start", { message: "draw-start" });

    // 120초 뒤 result state start
    setTimeout(() => {
      this.notifyResultState(server, roomId);
    }, 12 * 1000);
  }

  async notifyResultState(server: Server, roomId: string) {
    const record = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, { ...record, state: CatchMindState.RESULT });

    const { round, scores, totalScores } = record;
    this.logger.debug("result record");
    this.logger.debug(record);

    Object.entries(scores).forEach(([userId, score]) => {
      totalScores[userId] += score;
    });

    server.to(roomId).emit("catch-mind/result", { round, scores, totalScores });

    if (round === 5) {
      Object.entries(totalScores).forEach(async ([userIdString, addScore]) => {
        // 유저 점수에 totalScores 반영
        const userId = Number(userIdString);
        const { score } = await this.prisma.user.findFirst({ where: { userId } });
        await this.prisma.user.update({ where: { userId }, data: { score: score + (addScore as number) } });
      });
      // 게임 종료
      await this.redis.hdel(RedisTableName.PLAY_DATA, roomId);
      return;
    }

    const room = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    const wordList = await this.prisma.catchMindWordList.findMany();
    const answer: string = randFromArray(wordList).word;
    const drawerId: number = randFromArray(room.participants).userId;
    Object.keys(scores).forEach(userId => {
      scores[userId] = 0;
    });

    const newRecord = {
      round: round + 1,
      answer,
      drawerId,
      scores,
      totalScores,
    };
    await this.redis.updateTo(RedisTableName.PLAY_DATA, roomId, newRecord);

    // 15초 뒤 round start
    setTimeout(() => {
      this.notifyRoundStart(server, roomId, room.participants, newRecord);
    }, 15 * 1000);
  }

  async judge(socket: Socket, roomId: string, trial: string) {}
}
