import { JwtModule as JwtModuleBeforeRegister } from "@nestjs/jwt";
import { JWT_SECRET_KEY } from "src/constants/config";

export const JwtModule = JwtModuleBeforeRegister.register({
  secret: JWT_SECRET_KEY,
});
