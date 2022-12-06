/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect, useCallback } from "react";
import * as style from "./styles";
import timerImage from "../../../assets/icons/timer.png";
import { User } from "@dto";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../../store/user";
import { socketState } from "../../../store/socket";

export default function CatchMind() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [debounce, setDebounce] = useState("");
  const socket = useRecoilValue(socketState);

  const [user, setUser] = useRecoilState(userState);
  const [time, setTime] = useState<number>(120);
  const [answer, setAnswer] = useState<string>("테스트");
  const [round, setRound] = useState<number>(1);
  const [drawerId, setDrawerId] = useState<number>(0);
  const [scores, setScores] = useState<Map<number, number>>(new Map<number, number>());
  const [survivors, setSurvivors] = useState<number[]>([]);

  const startDrawing = useCallback((e: MouseEvent) => {
    setIsDrawing(true);
  }, []);

  const onDrawing = useCallback(
    (e: MouseEvent) => {
      const ctx = ctxRef.current;
      if (isDrawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        const imageData = canvasRef.current?.toDataURL("image/png");
        console.log("sending");
        socket.emit("catch-mind/image", imageData);
      }
      ctx.moveTo(e.offsetX, e.offsetY);
    },
    [isDrawing]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", onDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", onDrawing);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [startDrawing, onDrawing, stopDrawing]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 804;
    canvas.height = 514;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "black";
    ctx.strokeStyle = "2";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    console.log(1);
    socket.on("catch-mind/image", data => {
      // data
      console.log("receiving");
      // ctxRef.current.drawImage(data, 0, 0);
    });
    return () => {
      socket.off("catch-mind/image");
    };
  }, [socket]);

  return (
    <div css={style.gameWrapperStyle}>
      <div css={style.gameViewStyle}>
        <div css={style.headerStyle}>
          <div css={style.timerStyle}>
            <img src={timerImage} alt="timer" />
            <span>{time}</span>
          </div>
          <div css={style.answerStyle}>
            <span>{answer}</span>
          </div>
          <div css={style.roundStyle}>
            <span>Round {round} / 5</span>
          </div>
        </div>
        <div css={style.canvasStyle}>
          <canvas ref={canvasRef} />
        </div>
      </div>
      <div css={style.paletteStyle}></div>
    </div>
  );
}
