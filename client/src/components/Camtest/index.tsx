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
    socket.emit("media/joinRoom", { roomId }, (data: { rtpCapabilities: RtpCapabilities }) => {
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
    socket.emit("media/createWebRtcTransport", { consumer: false }, (transportOptions: TransportOptions) => {
      const producerTransport = device.createSendTransport(transportOptions);
      handleCreateProducerTransport(producerTransport);
    });
  };

  const handleCreateProducerTransport = (producerTransport: Transport) => {
    producerTransport.on("connect", ({ dtlsParameters }, cb, eb) => {
      try {
        socket.emit("media/transport-connect", { dtlsParameters });
        cb();
      } catch (error: any) {
        eb(error);
      }
    });

    producerTransport.on("produce", (parameters, cb, eb) => {
      try {
        socket.emit(
          "media/transport-produce",
          { kind: parameters.kind, rtpParameters: parameters.rtpParameters, appData: parameters.appData },
          ({ duplicated, id, producersExist }: { duplicated: boolean; id: string; producersExist: boolean }) => {
            if (!duplicated) {
              cb({ id });
              if (producersExist) getProducers();
            }
          }
        );
      } catch (error: any) {
        eb(error);
      }
    });

    connectSendTransport(producerTransport);
  };

  const connectSendTransport = async (producerTransport: Transport) => {
    let audioProducer = await producerTransport.produce(audioParams);
    let videoProducer = await producerTransport.produce(videoParams);
  };

  const getProducers = () => {
    socket.emit("media/getProducers", (producerList: string[]) => {
      producerList.forEach(signalNewConsumerTransport);
    });
  };

  const signalNewConsumerTransport = async (remoteProducerId: string) => {
    socket.emit("media/createWebRtcTransport", { consumer: true }, (transportOptions: TransportOptions) => {
      try {
        let consumerTransport = device.createRecvTransport(transportOptions);
        consumerTransport.on("connect", ({ dtlsParameters }, cb, eb) => {
          try {
            socket.emit("media/transport-recv-connect", {
              dtlsParameters,
              serverConsumerTransportId: transportOptions.id,
            });
            cb();
          } catch (error: any) {
            eb(error);
          }
        });
        connectRecvTransport(consumerTransport, remoteProducerId, transportOptions.id);
      } catch (err) {
        console.log(err);
        return;
      }
    });
  };

  const connectRecvTransport = (
    consumerTransport: Transport,
    remoteProducerId: string,
    serverConsumerTransportId: string
  ) => {
    console.log("connectRecvTransport");
    socket.emit(
      "media/consume",
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async (params: ConsumerOptions) => {
        console.log(params);
        const consumer = await consumerTransport.consume(params);

        setConsumerTransports((current: ConsumerTransport[]) => [
          ...current,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ]);

        const { track } = consumer;
        setCams(current => [...current, remoteProducerId]);
        const refIndex = cams.indexOf(remoteProducerId);
        remoteVideoRef.current[refIndex].srcObject = new MediaStream([track]);
      }
    );
  };

  useEffect(() => {
    getLocalStream();
    socket.on("media/new-producer", ({ producerId }) => {
      signalNewConsumerTransport(producerId);
    });
    return () => {
      socket.off("media/new-producer");
      socket.emit("media/disconnect");
    };
  }, []);

  return (
    <div>
      <Cam videoRef={localVideoRef} isVideoOn={true} isAudioOn={true} profile="profile/default/png" nickname="test" />
      {cams.map((cam, idx) => {
        return (
          <Cam
            key={idx}
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
