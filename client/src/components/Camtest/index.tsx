import { Device } from "mediasoup-client";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";

const Camtest = () => {
  const socket = useRecoilValue(socketState);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  let audioParams: any;
  let videoParams: any;
  let rtpCapabilites: any;
  const [device, setDevice] = useState<Device>(new Device());

  const streamSuccess = (stream: any) => {
    if (!localVideoRef.current) return;

    localVideoRef.current.srcObject = stream;
    audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
    videoParams = { track: stream.getVideoTracks()[0], ...videoParams };

    joinRoom();
  };

  const joinRoom = () => {
    const roomId = "room-id";
    socket.emit("video-join", { roomId }, (data: any) => {
      rtpCapabilites = data.rtpCapabilities;
      createDevice();
    });
  };

  const getLocalStream = () => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          width: { min: 640, max: 1920 },
          height: { min: 400, max: 1080 },
        },
      })
      .then(streamSuccess)
      .catch(error => {
        console.log(error.message);
      });
  };

  const createDevice = async () => {
    try {
      device.load({
        routerRtpCapabilities: rtpCapabilites,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    socket.on("video-join-success", data => {
      getLocalStream();
    });
    return () => {
      socket.off("video-join-success");
    };
  }, []);

  return <div>Camtest</div>;
};

export default Camtest;
