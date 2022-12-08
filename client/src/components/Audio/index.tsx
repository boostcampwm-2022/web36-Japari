import { useEffect, useRef } from "react";

export interface AudioProps {
  mediaStream: MediaStream | null;
}

const Audio = ({ mediaStream }: AudioProps) => {
  const audioRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return <audio ref={audioRef} autoPlay></audio>;
};

export default Audio;
