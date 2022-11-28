import { ConfigService } from "@nestjs/config";
import { JwtModule as JwtModuleWithoutRegister } from "@nestjs/jwt";

export const JwtModule = JwtModuleWithoutRegister.registerAsync({
  useFactory: async (config: ConfigService) => ({
    secret: config.get<string>("JWT_SECRET_KEY"),
  }),
  inject: [ConfigService],
});
