import { Device } from "mediasoup-client";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/Consumer";
import { ProducerOptions } from "mediasoup-client/lib/Producer";
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters";
import { Transport, TransportOptions } from "mediasoup-client/lib/Transport";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { socketState } from "../../store/socket";
import Cam from "../Cam";
import * as style from "./styles";

type ConsumerTransport = {
  consumerTransport: Transport;
  serverConsumerTransportId?: string;
  producerId: string;
  consumer: Consumer;
};

const Camtest = () => {
  const socket = useRecoilValue(socketState);
  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement[]>([]);

  let params = {
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
    ],
    codeOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };
  let audioParams: ProducerOptions;
  let videoParams: ProducerOptions = params;
  let rtpCapabilites: RtpCapabilities;
  const [device, setDevice] = useState<Device>(new Device());
  const [cams, setCams] = useState<any[]>([]);
  const [consumerTransports, setConsumerTransports] = useState<ConsumerTransport[]>([]);

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

  const streamSuccess = (stream: any) => {
    if (!localVideoRef.current) return;

    localVideoRef.current.srcObject = stream;
    audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
    videoParams = { track: stream.getVideoTracks()[0], ...videoParams };

    joinRoom();
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { roomId }, (data: { rtpCapabilities: RtpCapabilities }) => {
      rtpCapabilites = data.rtpCapabilities;
      createDevice();
    });
  };

  const createDevice = async () => {
    try {
      await device.load({
        routerRtpCapabilities: rtpCapabilites,
      });
      createSendTransport();
    } catch (err) {
      console.log(err);
    }
  };

  const createSendTransport = async () => {
    socket.emit("createWebRtcTransport", { consumer: false }, (params: TransportOptions) => {
      let producerTransport = device.createSendTransport(params);

      producerTransport.on("connect", ({ dtlsParameters }, cb, eb) => {
        try {
          socket.emit("transport-connect", { dtlsParameters });
          cb();
        } catch (error: any) {
          eb(error);
        }
      });

      producerTransport.on("produce", (parameters, cb, eb) => {
        try {
          socket.emit(
            "transport-produce",
            { kind: parameters.kind, rtpCapabilites: parameters.rtpParameters, appData: parameters.appData },
            (id: string, producerExist: boolean) => {
              cb({ id });
              if (producerExist) getProducers();
            }
          );
        } catch (error: any) {
          eb(error);
        }
      });

      connectSendTransport(producerTransport);
    });
  };

  const connectSendTransport = async (producerTransport: Transport) => {
    let audioProducer = await producerTransport.produce(audioParams);
    let videoProducer = await producerTransport.produce(videoParams);
  };

  const getProducers = () => {
    socket.emit("getProducers", (producers: string[]) => {
      producers.forEach(signalNewConsumerTransport);
    });
  };

  const signalNewConsumerTransport = async (remoteProduceId: string) => {
    socket.emit("createWebRtcTransport", { consumer: true }, (params: TransportOptions) => {
      try {
        let consumerTransport = device.createRecvTransport(params);
        consumerTransport.on("connect", ({ dtlsParameters }, cb, eb) => {
          try {
            socket.emit("transport-recv-connect", {
              dtlsParameters,
              serverConsumerTransportId: params.id,
            });
            cb();
          } catch (error: any) {
            eb(error);
          }
        });
        connectRecvTransport(consumerTransport, remoteProduceId, params.id);
      } catch (err) {
        console.log(err);
        return;
      }
    });
  };

  const connectRecvTransport = (
    consumerTransport: Transport,
    remoteProduceId: string,
    serverConsumerTransportId: string
  ) => {
    socket.emit(
      "consume",
      {
        rtpCapabilites: device.rtpCapabilities,
        remoteProduceId,
        serverConsumerTransportId,
      },
      async (params: ConsumerOptions) => {
        const consumer = await consumerTransport.consume(params);

        setConsumerTransports((current: ConsumerTransport[]) => [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProduceId,
            consumer,
          },
        ]);

        const { track } = consumer;
        setCams(current => [...current, remoteProduceId]);
        const refIndex = cams.indexOf(remoteProduceId);
        remoteVideoRef.current[refIndex].srcObject = new MediaStream([track]);
      }
    );
  };

  useEffect(() => {
    getLocalStream();
    socket.on("video-join-success", data => {
      getLocalStream();
    });
    socket.on("new-producer", ({ producerId }) => {
      signalNewConsumerTransport(producerId);
    });
    return () => {
      socket.off("video-join-success");
    };
  }, []);

  return (
    <div>
      <Cam videoRef={localVideoRef} isVideoOn={true} isAudioOn={true} profile="profile/default/png" nickname="test" />
      {cams.map((cam, idx) => {
        return (
          <Cam
            videoRef={(el: HTMLVideoElement) => {
              if (el) remoteVideoRef.current[idx] = el;
            }}
            isVideoOn={true}
            isAudioOn={true}
            profile="profile/default/png"
            nickname="test"
          />
        );
      })}
    </div>
  );
};

export default Camtest;
