/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect, useCallback } from "react";
import * as style from "./styles";
import timerImage from "../../../assets/icons/timer.png";
import { User } from "@dto";
import { useRecoilState, useRecoilValue } from "recoil";
import { userState } from "../../../store/user";
import { socketState } from "../../../store/socket";
import { debounce } from "lodash";

import pencilIcon from "../../../assets/icons/catch-mind-pencil.png";
import eraserIcon from "../../../assets/icons/catch-mind-eraser.png";
import { useNavigate, useLocation } from "react-router-dom";

enum Color {
  WHITE = "white",
  BLACK = "black",
  RED = "red",
  YELLOW = "yellow",
  GREEN = "green",
  PURPLE = "purple",
  GRAY = "gray",
  ORANGE = "orange",
  BLUE = "blue",
  SKYBLUE = "skyblue",
  PINK = "pink",
  BROWN = "brown",
  GOLD = "gold",
  DARKBLUE = "darkblue",
}

const WAIT_TIME = 5;
const DRAW_TIME = 120; // 120
const RESULT_TIME = 15; //15

enum CatchMindState {
  WAIT,
  DRAW,
  RESULT,
}

const COLOR_LIST = [
  "BLACK",
  "RED",
  "ORANGE",
  "YELLOW",
  "GREEN",
  "BLUE",
  "DARKBLUE",
  "PURPLE",
  "GRAY",
  "SKYBLUE",
  "PINK",
  "BROWN",
];

const THIN = 1;
const NORMAL = 5;
const THICK = 9;

export default function CatchMind() {
  const navigate = useNavigate();
  const path = useLocation().pathname.split("/").slice(1)[1];

  const socket = useRecoilValue(socketState);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"pencil" | "eraser">("pencil");
  const [line, setLine] = useState<"THIN" | "NORMAL" | "THICK">("NORMAL");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [currentLineWidth, setCurrentLineWidth] = useState<Number>(2);
  const currentColorRef = useRef<string>("black");

  const [user, setUser] = useRecoilState(userState);
  const [time, setTime] = useState<number>(WAIT_TIME);
  const timeRef = useRef<number | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [round, setRound] = useState<number>(1);
  const roundRef = useRef<number>(1);
  const stateRef = useRef<number>(0);
  const [drawerId, setDrawerId] = useState<number>(0);

  const timer = useRef<NodeJS.Timer | null>(null);
  if (timeRef) {
    timeRef.current = time;
  }
  roundRef.current = round;
  currentColorRef.current = currentColor;

  const getContextObject = useCallback(() => {
    const ctx = canvasRef.current?.getContext("2d");
    return ctx as CanvasRenderingContext2D;
  }, []);

  const fillCanvas = useCallback(() => {
    const ctx = getContextObject();
    ctx.fillStyle = currentColorRef.current;
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.beginPath();
  }, []);

  const clearCanvas = useCallback(() => {
    const ctx = getContextObject();
    ctx.fillStyle = Color.WHITE;
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.fillStyle = currentColorRef.current;
    ctx.beginPath();
  }, []);

  const writeCenter = useCallback((text: string, dx?: number, dy?: number) => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = getContextObject();
    const metrics = ctx.measureText(text);
    const width = metrics.width;
    const height = metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent;

    const x = canvas.width / 2 - width / 2;
    const y = canvas.height / 2 - height / 2;

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.fillText(text, x + (dx ?? 0), y + (dy ?? 0));
    ctx.fillStyle = currentColorRef.current;
    ctx.beginPath();
  }, []);

  const handleDebounce = useCallback(
    debounce(imageData => {
      socket.emit("catch-mind/image", { round, imageData });
    }, 100),
    [round]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const startDrawing = useCallback((e: MouseEvent) => {
    setIsDrawing(true);
  }, []);

  const onDrawing = useCallback(
    (e: MouseEvent) => {
      const ctx = getContextObject();
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

  const handleSelectColor = useCallback(
    (color: string) => {
      if (user?.userId !== drawerId || stateRef.current !== CatchMindState.DRAW) return;
      setCurrentColor(color);
    },
    [drawerId]
  );

  const handleLineWidth = useCallback((line: "THIN" | "NORMAL" | "THICK") => {
    setLine(line);

    const ctx = getContextObject();
    ctx.beginPath();
    switch (line) {
      case "THIN":
        ctx.lineWidth = THIN;
        break;
      case "NORMAL":
        ctx.lineWidth = NORMAL;
        break;
      case "THICK":
        ctx.lineWidth = THICK;
        break;
    }
    ctx.closePath();
  }, []);

  useEffect(() => {
    socket.emit("catch-mind/start");
    socket.on("catch-mind/round-start", data => {
      stateRef.current = CatchMindState.WAIT;

      if (data.answer) setAnswer(answer);
      setRound(data.round);
      setDrawerId(data.drawerId);

      clearCanvas();
      writeCenter(`Round ${data.round} 준비`);

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
      stateRef.current = CatchMindState.DRAW;

      clearCanvas();
      writeCenter(`Round ${data.round} 시작!`);

      setTimeout(() => {
        clearCanvas();
      }, 1000);

      setTime(DRAW_TIME);
    });

    return () => {
      socket.off("catch-mind/draw-start");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("catch-mind/result", data => {
      stateRef.current = CatchMindState.RESULT;

      clearCanvas();
      const ctx = getContextObject();
      ctx.font = "30px LINESeedKR";
      writeCenter(`Round ${data.round} 결과`, 0, -120);
      writeCenter(`닉네임 / 라운드 / 게임`, 0, -60);
      ctx.font = "20px LINESeedKR";
      data.scoreInfo.forEach(({ nickname, score, totalScore }: any, index: number) => {
        writeCenter(`${nickname} / ${score} / ${totalScore}`, 0, -10 + index * 30);
      });
      ctx.font = "40px LINESeedKR";

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (stateRef.current !== CatchMindState.DRAW) return;
    if (drawerId !== user?.userId) return;
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
  }, [startDrawing, onDrawing, stopDrawing, stateRef.current, drawerId]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 510;

    const ctx = getContextObject();
    ctx.font = "40px LINESeedKR bold";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
  }, []);

  useEffect(() => {
    socket.on("catch-mind/image", data => {
      const image = new Image();
      image.onload = () => {
        if (roundRef.current !== data.round) return;
        if (stateRef.current !== CatchMindState.DRAW) return;
        const ctx = getContextObject();
        ctx.drawImage(image, 0, 0);
      };
      image.src = data.imageSrc;
    });
    return () => {
      socket.off("catch-mind/image");
    };
  }, [socket, round]);

  useEffect(() => {
    socket.on("catch-mind/end", () => {
      navigate(`/waiting/${path}`);
    });
  });

  useEffect(() => {
    const ctx = getContextObject();
    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
  }, [currentColor]);

  useEffect(() => {
    const ctx = getContextObject();
    if (mode === "pencil") {
      ctx.beginPath();
      ctx.strokeStyle = currentColorRef.current;
    }
    if (mode === "eraser") {
      ctx.beginPath();
      ctx.strokeStyle = Color.WHITE;
    }
  }, [mode]);

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

      <div css={style.paletteStyle}>
        <div css={style.toolStyle}>
          <div css={style.toggleStyle(mode, "pencil")} onClick={() => setMode("pencil")}>
            <img src={pencilIcon} alt="pencil" />
          </div>

          <div css={style.toggleStyle(mode, "eraser")} onClick={() => setMode("eraser")}>
            <img src={eraserIcon} alt="eraser" />
          </div>
        </div>

        <div css={style.lineWidthStyle}>
          <div onClick={() => handleLineWidth("THIN")} css={style.buttonStyle(line, "THIN")}>
            얇게
          </div>
          <div onClick={() => handleLineWidth("NORMAL")} css={style.buttonStyle(line, "NORMAL")}>
            보통
          </div>
          <div onClick={() => handleLineWidth("THICK")} css={style.buttonStyle(line, "THICK")}>
            굵게
          </div>
        </div>

        <div css={style.clearStyle} onClick={clearCanvas}>
          clear
        </div>

        <div css={style.selectedColorStyle(currentColor)}></div>

        <div css={style.colorGridStyle}>
          {COLOR_LIST.map((color, idx) => (
            <div css={style.colorStyle(color)} onClick={() => handleSelectColor(color)} key={idx}></div>
          ))}
        </div>
      </div>
    </div>
  );
}
