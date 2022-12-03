import { Injectable } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { SignOptions, VerifyOptions } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "src/constants/config";

@Injectable()
export class JwtService {
  sign(payload: any, options?: SignOptions) {
    return jwt.sign(payload, JWT_SECRET_KEY, options);
  }

  verify(token: string, options?: VerifyOptions) {
    return jwt.verify(token, JWT_SECRET_KEY, options) as jwt.JwtPayload;
  }
}
