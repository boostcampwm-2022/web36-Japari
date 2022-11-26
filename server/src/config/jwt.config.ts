import { ConfigService } from "@nestjs/config";

export default {
  useFactory: async (config: ConfigService) => ({
    secret: config.get<string>("JWT_SECRET_KEY"),
  }),
  inject: [ConfigService],
};
