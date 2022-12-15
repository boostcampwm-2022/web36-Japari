// import { useCallback, useState } from "react";
// import { StreamInfo } from "./useCams";
// import { User } from "@dto";

export function useHandleMikeCams() {
  //   const [remoteVideoOnOff, setRemoteVideoOnOff] = useState<Map<number, boolean>>(new Map());
  //   const [remoteAudioOnOff, setRemoteAudioOnOff] = useState<Map<number, boolean>>(new Map());
  //   const initializeMediaStatus = useCallback(
  //     (participant: User, videoStreamInfo: StreamInfo | undefined, audioStreamInfo: StreamInfo | undefined) => {
  //       if (videoStreamInfo) {
  //         setRemoteVideoOnOff(current => {
  //           const newMap = new Map(current);
  //           newMap.set(participant.userId, videoStreamInfo.mediaStream.getVideoTracks()[0].enabled);
  //           return newMap;
  //         });
  //       }
  //       if (audioStreamInfo) {
  //         setRemoteAudioOnOff(current => {
  //           const newMap = new Map(current);
  //           newMap.set(participant.userId, audioStreamInfo.mediaStream.getAudioTracks()[0].enabled);
  //           return newMap;
  //         });
  //       }
  //     },
  //     []
  //   );
  //   useEffect(() => {
  //     if (audioStream.size > 0 && videoStream.size > 0) {
  //       socket.emit("audio-status/modify", audio);
  //     }
  //   }, [audio, socket, audioStream, videoStream]);
}
