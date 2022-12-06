/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect, useCallback } from "react";
import * as style from "./styles";
import timerImage from "../../../assets/icons/timer.png";
import { User } from "@dto";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../../store/user";
import { socketState } from "../../../store/socket";

interface Coordinate {
  x: number;
  y: number;
}

const WAIT_TIME = 10;
const DRAW_TIME = 10;
const RESULT_TIME = 10;

export default function CatchMind() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [position, setPosition] = useState<Coordinate | undefined>(undefined);
  const [isDrawing, setIsDrawing] = useState(false);

  const [user, setUser] = useRecoilState(userState);
  const [time, setTime] = useState<number>(120);
  const timeRef = useRef<number | null>(null);
  const [answer, setAnswer] = useState<string>("테스트");
  const [round, setRound] = useState<number>(1);
  const [drawerId, setDrawerId] = useState<number>(0);
  const [scores, setScores] = useState<Map<number, number>>(new Map<number, number>());
  const [totalScores, setTotalScores] = useState<Map<number, number>>(new Map<number, number>());
  const [debug, setDebug] = useState<string>("");
  const timer = useRef<NodeJS.Timer | null>(null);

  const socket = useRecoilValue(socketState);
  if (timeRef) {
    timeRef.current = time;
  }

  useEffect(() => {
    setDebug("캐치마인드 시작");
    socket.emit("catch-mind/start");
    socket.on("catch-mind/round-start", data => {
      if (data.answer) {
        setAnswer(answer);
      }

      setRound(data.round);
      setDrawerId(data.drawerId);
      setDebug(`Round ${data.round}이 곧 시작됩니다.`);

      setTime(WAIT_TIME);
    });
    return () => {
      socket.off("catch-mind/round-start");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("catch-mind/draw-start", data => {
      setDebug(`Round ${round} 진행중...`);

      setTime(DRAW_TIME);
    });

    return () => {
      socket.off("catch-mind/draw-start");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("catch-mind/result", data => {
      setDebug(`Round ${data.round} 결과...`);
      console.log(`Round ${data.round} 결과`, data);

      setTime(RESULT_TIME);
    });

    return () => {
      socket.off("catch-mind/result");
    };
  }, [socket]);

  useEffect(() => {
    timer.current = setInterval(() => {
      if (timeRef.current && timeRef.current > 0) {
        setTime(time => time - 1);
      }
    }, 1000);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  // useEffect(() => {
  //   console.log(time, timer.current);
  //   if (time <= 0 && timer.current) {
  //     console.log("cleared!");
  //     clearInterval(timer.current);
  //     timer.current = null;
  //   }
  // }, [time, timer.current]);

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
          <div>{debug}</div>
        </div>
        <canvas css={style.canvasStyle} ref={canvasRef} />
      </div>
      <div css={style.paletteStyle}></div>
    </div>
  );
}
