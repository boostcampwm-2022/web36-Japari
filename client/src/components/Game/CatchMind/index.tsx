import React, { useRef } from "react";
import * as style from "./styles";

export default function CatchMind() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current as HTMLCanvasElement;

  return <canvas css={style.canvasStyle} />;
}
