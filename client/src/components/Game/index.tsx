/** @jsxImportSource @emotion/react */
import { GameName } from "../../constants/enum";
import React from "react";
import CatchMind from "./CatchMind";

interface GameProps {
  gameId: number;
}

export default function Game({ gameId }: GameProps) {
  switch (gameId) {
    case GameName.CATCH_MIND:
      return <CatchMind />;
    // case GameName.BATTLE_SHIP:
    // return <BattleShip />;
    default:
      return <></>;
  }
}
