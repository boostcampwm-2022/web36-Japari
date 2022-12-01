import { User } from "@prisma/client";
import "express";

declare module "express" {
  export declare interface RequestWithUser extends Request {
    user: User;
  }

  export declare interface RequestWithUserAndRefreshToken extends Request {
    user: User;
    oldRefreshToken: string;
  }
}
