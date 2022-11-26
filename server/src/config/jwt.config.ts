import { ConfigService } from "@nestjs/config";

export const jwtConfig = {
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>("JWT_SECRET_KEY"),
  }),
  inject: [ConfigService],
};
