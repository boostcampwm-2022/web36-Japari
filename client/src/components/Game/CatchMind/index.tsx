/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect, useCallback } from "react";
import * as style from "./styles";
import timerImage from "../../../assets/icons/timer.png";
import { User } from "@dto";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../../store/user";
import { socketState } from "../../../store/socket";
import { debounce } from "lodash";

const WAIT_TIME = 10;
const DRAW_TIME = 10;
const RESULT_TIME = 10;

export default function CatchMind() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<any>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const socket = useRecoilValue(socketState);

  const [user, setUser] = useRecoilState(userState);
  const [time, setTime] = useState<number>(120);
  const timeRef = useRef<number | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [round, setRound] = useState<number>(1);
  const [drawerId, setDrawerId] = useState<number>(0);
  const [debug, setDebug] = useState<string>("");
  const timer = useRef<NodeJS.Timer | null>(null);

  if (timeRef) {
    timeRef.current = time;
  }

  useEffect(() => {
    setDebug("캐치마인드 시작");
    socket.emit("catch-mind/start");
    socket.on("catch-mind/round-start", data => {
      if (data.answer) setAnswer(answer);
      setRound(data.round);
      setDrawerId(data.drawerId);
      console.log(`Round ${data.round}이 곧 시작됩니다...`);
      if (data.answer) {
        setAnswer(data.answer);
      } else {
        setAnswer("");
      }
      setTime(WAIT_TIME);
    });
    return () => {
      socket.off("catch-mind/round-start");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("catch-mind/draw-start", data => {
      alert(`Round ${data.round} 시작!`);

      setTime(DRAW_TIME);
    });

    return () => {
      socket.off("catch-mind/draw-start");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("catch-mind/result", data => {
      let resultSummary = `Round ${data.round} 결과` + "\n";
      resultSummary += `닉네임 / 라운드 / 게임` + "\n";
      data.scoreInfo.forEach(({ nickname, score, totalScore }: any) => {
        resultSummary += `${nickname} / ${score} / ${totalScore}` + "\n";
      });
      console.log(resultSummary);

      setAnswer(data.answer);

      setTime(RESULT_TIME);
    });

    return () => {
      socket.off("catch-mind/result");
    };
  }, [socket]);

  // 타이머
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
        handleDebounce(imageData);
      }
      ctx.moveTo(e.offsetX, e.offsetY);
    },
    [isDrawing]
  );

  const handleDebounce = useCallback(
    debounce(data => {
      socket.emit("catch-mind/image", data);
      console.log("send");
    }, 100),
    []
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
    canvas.width = 700;
    canvas.height = 510;

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
