/** @jsxImportSource @emotion/react */
import { GameName } from "../../constants/enum";
import React from "react";
import CatchMind from "./CatchMind";
import { User } from "@dto";

interface GameProps {
  gameId: number;
  participants: User[];
}

export default function Game({ gameId, participants }: GameProps) {
  switch (gameId) {
    case GameName.CATCH_MIND:
      return <CatchMind participants={participants} />;
    // case GameName.BATTLE_SHIP:
    // return <BattleShip />;
    default:
      return <></>;
  }
}
