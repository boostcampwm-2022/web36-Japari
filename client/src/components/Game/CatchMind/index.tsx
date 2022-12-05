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

  const getCoordinates = (e: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    return {
      x: e.pageX - canvas.offsetLeft,
      y: e.pageY - canvas.offsetTop,
    };
  };

  const startDrawing = useCallback((e: MouseEvent) => {
    const coordinates = getCoordinates(e);
    if (coordinates) {
      console.log(1);
      setIsDrawing(true);
      setPosition(coordinates);
    }
  }, []);

  const drawPaints = (curPosition: Coordinate, nextPosition: Coordinate) => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log(4);
    if (!ctx) return;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2.5;
    console.log(5);
    ctx.beginPath();
    ctx.moveTo(curPosition.x, curPosition.y);
    ctx.lineTo(nextPosition.x, nextPosition.y);
    ctx.closePath();
    ctx.stroke();
  };

  const onDrawing = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log(2);
      if (isDrawing) {
        const nextPosition = getCoordinates(e);
        if (position && nextPosition) {
          console.log(3);
          drawPaints(position, nextPosition);
          setPosition(nextPosition);
        }
      }
    },
    [isDrawing, position]
  );

  const exitPaint = useCallback(() => {
    setIsDrawing(false);
    console.log(6);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", onDrawing);
    canvas.addEventListener("mouseup", exitPaint);
    canvas.addEventListener("mouseleave", exitPaint);
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", onDrawing);
      canvas.removeEventListener("mouseup", exitPaint);
      canvas.removeEventListener("mouseleave", exitPaint);
    };
  }, [startDrawing, onDrawing, exitPaint]);

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
