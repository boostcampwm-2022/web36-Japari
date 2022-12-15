// import { useState } from "react";
// import { StreamInfo } from "./useCams";
// import { User } from "@dto";

export const useVideoOnOffs = () => {
  //   const [onOff, setOnOff] = useState<Map<number, boolean>>(new Map());
  //   const handleSetOnOff = (participant: User, videoStreamInfo: StreamInfo | undefined) => {
  //     if (videoStreamInfo) {
  //       setOnOff(current => {
  //         const newMap = new Map(current);
  //         newMap.set(participant.userId, videoStreamInfo.mediaStream.getVideoTracks()[0].enabled);
  //         return newMap;
  //       });
  //     }
  //   };
  //   setRemoteVideoOnOff(current => {
  //     const newMap = new Map(current);
  //     newMap.set(userInfo.userId, videoStatus);
  //     return newMap;
  //   });
  //   return [onOff, handleSetOnOff];
};

// export const useAudioOnOffs = () => {
//   const [onOff, setOnOff] = useState<Map<number, boolean>>(new Map());

//   const handleSetOnOff = (participant: User, videoStreamInfo: StreamInfo | undefined) => {
//     if (videoStreamInfo) {
//       setOnOff(current => {
//         const newMap = new Map(current);
//         newMap.set(participant.userId, videoStreamInfo.mediaStream.getVideoTracks()[0].enabled);
//         return newMap;
//       });
//     }
//   };
//   return [onOff, handleSetOnOff];
// };
