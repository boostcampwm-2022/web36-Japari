/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect, useCallback } from "react";
import * as style from "./styles";
import timerImage from "../../../assets/icons/timer.png";
import { User } from "@dto";
import { useRecoilState } from "recoil";
import { userState } from "../../../store/user";

interface Coordinate {
  x: number;
  y: number;
}

export default function CatchMind() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState<Coordinate | undefined>(undefined);
  const [isDrawing, setIsDrawing] = useState(false);

  const [user, setUser] = useRecoilState(userState);
  const [time, setTime] = useState<number>(120);
  const [answer, setAnswer] = useState<string>("테스트");
  const [round, setRound] = useState<number>(1);
  const [drawerId, setDrawerId] = useState<number>(0);
  const [scores, setScores] = useState<Map<number, number>>(new Map<number, number>());
  const [survivors, setSurvivors] = useState<number[]>([]);

  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop,
    };
  };

  const startDrawing = useCallback((e: MouseEvent) => {
    const coordinates = getCoordinates(e);
    if (coordinates) {
      setIsDrawing(true);
      setPosition(coordinates);
    }
  }, []);

  const drawPaints = useCallback((curPosition: Coordinate, nextPosition: Coordinate) => {
    //
  }, []);

  const onDrawing = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDrawing) {
      const nextPosition = getCoordinates(e);
      if (position && nextPosition) {
        drawPaints(position, nextPosition);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!canvas) return;
    if (!ctx) return;
    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 2.5;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousedown", onDrawing);
  }, []);

  return (
    <div css={style.gameWrapperStyle}>
      <div css={style.gameViewStyle}>
        <div css={style.headerStyle}>
          <div css={style.timerStyle}>
            <img src={timerImage} />
            <span>{time}</span>
          </div>
          <div css={style.answerStyle}>
            <span>{answer}</span>
          </div>
          <div css={style.roundStyle}>
            <span>Round {round} / 5</span>
          </div>
        </div>
        <canvas css={style.canvasStyle} ref={canvasRef} />
      </div>
      <div css={style.paletteStyle}></div>
    </div>
  );
}
