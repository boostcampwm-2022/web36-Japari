import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import Redis from "ioredis";
import { PrismaService } from "src/modules/prisma/prisma.service";

@Injectable()
export class GameRoomService {}
