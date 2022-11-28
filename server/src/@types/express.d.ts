import { User } from "@prisma/client";
import "express";

declare module "express" {
  export declare interface RequestWithAccessToken extends Request {
    user: User;
  }

  export declare interface RequestWithRefreshToken extends Request {
    user: User;
    oldRefreshToken: string;
  }
}
