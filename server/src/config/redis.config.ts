import { ConfigModule, ConfigService } from "@nestjs/config";

export default {
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    return {
      connectionOptions: {
        host: config.get("REDIS_HOST"),
        port: config.get("REDIS_PORT"),
        password: config.get("REDIS_PASSWORD"),
      },
    };
  },
  inject: [ConfigService],
};
