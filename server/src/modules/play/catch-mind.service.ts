import { Injectable, Logger } from "@nestjs/common";
import { userInfo } from "os";
import { Server, Socket } from "socket.io";
import { CatchMindState, RedisTableName } from "src/constants/enum";
import { randFromArray } from "util/random";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { CatchMindRecord } from "./catch-mind.gateway";

const WAIT_TIME = 5;
const DRAW_TIME = 120; //120
const RESULT_TIME = 10; //15

interface CatchMindGameRoom {
  title: string;
  gameId: 1;
  minimumPeople: number;
  maximumPeople: number;
  isPrivate: boolean;
  password?: string;
  participants: Participant[];
}

interface Participant {
  email: string;
  nickname: string;
  profileImage: string;
  roomId: string;
  socketId: string;

  score: number;
  userId: number;

  connected: boolean;
}

@Injectable()
export class CatchMindService {
  private logger = new Logger("Catch Mind Service");
  constructor(private redis: RedisService, private prisma: PrismaService) {}

  async notifyRoundStart(server: Server, roomId: string, participants: Participant[], record: CatchMindRecord) {
    await this.redis.setTo(RedisTableName.PLAY_DATA, roomId, { ...record, state: CatchMindState.WAIT });
    const { drawerIndex, round, scores, totalScores, answer } = record;
    const drawerId = participants[drawerIndex].userId;

    const resp = {
      round,
      drawerId,
      scores,
      totalScores,
    };

    participants.forEach(({ userId, socketId }: { userId: number; socketId: string }) => {
      if (userId != drawerId) {
        server.to(socketId).emit("catch-mind/round-start", resp);
        return;
      }

      // drawer에게는 정답도 알려준다.
      server.to(socketId).emit("catch-mind/round-start", { ...resp, answer });
    });

    // 10초 뒤 draw state start
    setTimeout(() => {
      this.notifyDrawState(server, roomId);
    }, WAIT_TIME * 1000);
  }

  async notifyDrawState(server: Server, roomId: string) {
    await this.redis.updateTo(RedisTableName.PLAY_DATA, roomId, { state: CatchMindState.DRAW });
    const record: CatchMindRecord = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    if (!record || !record.round) return;
    const { round, playId } = record;
    server.to(roomId).emit("catch-mind/draw-start", { round });

    // 120초 뒤 result state start
    setTimeout(async () => {
      this.notifyResultState(server, roomId, round, playId);
    }, DRAW_TIME * 1000);
  }

  async notifyResultState(server: Server, roomId: string, callRound: number, callPlayId: string) {
    const record: CatchMindRecord = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    if (!record) return;
    const { playId, round, state, answer, scores, totalScores, drawerIndex } = record;
    // A. notifyResultState 함수를 예약한 시점(라운드)이 현재 시점(라운드)과 일치하지 않는다.
    // B. 현재 'DRAW' 단계가 아니다.
    // A 또는 B가 성립한다면 모든 사람이 정답을 맞춰 notifyResultState가 호출 됐으나 120초 setTimeout에 의해 예약된 함수가 지금 실행된 것이므로 무시한다.
    if (playId !== callPlayId || round !== callRound || state !== CatchMindState.DRAW) return;

    // totalScores를 갱신한다.
    Object.entries(scores).forEach(([userId, score]) => {
      totalScores[userId] += score;
    });

    // 사용자 전원에게 게임 결과를 전송한다
    let users;
    try {
      users = await this.prisma.user.findMany({
        where: {
          userId: { in: Object.keys(scores).map(score => Number(score)) },
        },
        select: { userId: true, nickname: true },
      });
    } catch (err) {
      console.error(err);
      return;
    }

    const scoreInfo = users.map(({ userId, nickname }) => {
      return { nickname, score: scores[String(userId)], totalScore: totalScores[String(userId)] };
    });

    server.to(roomId).emit("catch-mind/result", { round, answer, scoreInfo });

    // 마지막 라운드가 될 경우 게임을 종료한다.
    if (round === 5) {
      Object.entries(totalScores).forEach(async ([userIdString, addScore]) => {
        // 1. 유저 점수에 totalScores 반영
        const userId = Number(userIdString);
        const { score } = await this.prisma.user.findFirst({ where: { userId } });
        await this.prisma.user.update({ where: { userId }, data: { score: score + (addScore as number) } });
      });
      // 2. 게임 종료
      // 15초 뒤 round start
      setTimeout(async () => {
        await this.redis.hdel(RedisTableName.PLAY_DATA, roomId);
        server.to(roomId).emit("catch-mind/end");
      }, RESULT_TIME * 1000);

      return;
    }

    // 다음 라운드를 위한 레코드를 생성한다.
    const room: CatchMindGameRoom | null = await this.redis.getFrom(RedisTableName.GAME_ROOMS, roomId);
    const wordList = await this.prisma.catchMindWordList.findMany();
    const newAnswer: string = randFromArray(wordList).word;

    // 게임 로직이 진행중인데 방이 사라진 경우
    if (!room) {
      this.redis.hdel(RedisTableName.PLAY_DATA, roomId);
      return;
    }

    const newDrawerIndex = (drawerIndex + 1) % room.participants.length;
    Object.keys(scores).forEach(userId => {
      scores[userId] = 0;
    });

    const newRecord: CatchMindRecord = {
      gameId: 1,
      playId,
      round: round + 1,
      answer: newAnswer,
      drawerIndex: newDrawerIndex,
      scores,
      totalScores,
      state: CatchMindState.RESULT,
    };
    this.redis.setTo(RedisTableName.PLAY_DATA, roomId, newRecord);

    // 15초 뒤 round start
    setTimeout(() => {
      this.notifyRoundStart(server, roomId, room.participants, newRecord);
    }, RESULT_TIME * 1000);
  }

  async isDrawing(socket: Socket) {
    const { roomId } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    const playData = await this.redis.getFrom(RedisTableName.PLAY_DATA, roomId);
    return playData && playData.gameId === 1 && playData.state === CatchMindState.DRAW;
  }

  async judge(socket: Socket, server: Server, message: string, sendTime: string) {
    const { roomId } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    const { playId, drawerIndex, scores, answer, round }: CatchMindRecord = await this.redis.getFrom(
      RedisTableName.PLAY_DATA,
      roomId
    );
    const { userId, nickname } = await this.redis.getFrom(RedisTableName.SOCKET_ID_TO_USER_INFO, socket.id);
    const drawerId = Number(Object.keys(scores)[drawerIndex]);

    // 그림을 그리는 사람이나 정답을 맞춘 사람의 채팅은 허용하지 않는다.
    if (drawerId === userId || scores[String(userId)] > 0) {
      socket.emit("chat/room", {
        sender: "시스템",
        message: `현재 ${nickname}님의 채팅은 다른 사람들에게 보이지 않습니다.`,
        sendTime,
      });
      return;
    }

    // 오답일 경우 일반 채팅으로 처리한다.
    if (message !== answer) {
      socket.to(roomId).emit("chat/room", {
        sender: nickname,
        message,
        sendTime,
      });
      return;
    }

    // 정답일 경우
    // 1. 얻을 점수를 계산한다.
    // - 맞춘 사람은 일정 공식에 따라 점수 획득
    // - 그린 사람은 맞춘 사람 수 만큼 점수 획득
    // ex) 7명 중 1등을 할 경우 9점 획득
    // ex) 7명 중 7등을 할 경우 1점 획득

    const nonDrawersScores = Object.entries(scores).filter(([userId]) => Number(userId) !== drawerId);

    const nonDrawersCount = nonDrawersScores.length;
    const firstPrize = nonDrawersCount + 3; // 1등이 받을 점수
    const qualifiersCount = nonDrawersScores.filter(([, score]) => score > 0).length;
    const score = Math.floor((firstPrize * (nonDrawersCount - qualifiersCount)) / nonDrawersCount);

    // 2. 맞춘 사람과 그린 사람의 scores를 갱신한다.
    scores[String(userId)] += score;
    scores[String(drawerId)] += 1;
    await this.redis.updateTo(RedisTableName.PLAY_DATA, roomId, { scores });

    // 3. 방 전체에 정답자가 생겼다는 사실을 알린다.
    server.to(roomId).emit("chat/room", {
      sender: "시스템",
      message: `${nickname} 님이 정답을 맞추셨습니다! ${score}점을 획득했습니다!`,
      sendTime,
    });

    // 4. 전원 정답일 경우 바로 result state로 넘어간다.
    if (qualifiersCount + 1 === nonDrawersCount) {
      server.to(roomId).emit("chat/room", {
        sender: "시스템",
        message: `모든 유저가 정답을 맞추셨습니다!`,
        sendTime,
      });

      this.notifyResultState(server, roomId, round, playId);
    }
  }
}
