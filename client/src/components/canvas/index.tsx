import React, { useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current as HTMLCanvasElement;

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
}
