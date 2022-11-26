import { Controller, Get, Inject } from "@nestjs/common";
import Redis from "ioredis";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, @Inject("RedisProvider") private readonly redis: Redis) {}

  @Get("/test")
  test() {
    return this.redis.get("user-1");
  }
}
