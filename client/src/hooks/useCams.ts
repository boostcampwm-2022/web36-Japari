/** @jsxImportSource @emotion/react */
import { User } from "@dto";
import { Device } from "mediasoup-client";
import { Consumer } from "mediasoup-client/lib/Consumer";
import { ProducerOptions } from "mediasoup-client/lib/Producer";
import { MediaKind, RtpCapabilities, RtpParameters } from "mediasoup-client/lib/RtpParameters";
import { Transport, TransportOptions } from "mediasoup-client/lib/Transport";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { socketState } from "../store/socket";
import { userState } from "../store/user";
import { audioState, videoState, streamState } from "../store/media";

type ConsumerTransport = {
  consumerTransport: Transport;
  serverConsumerTransportId?: string;
  producerId: string;
  consumer: Consumer;
};

export type StreamInfo = {
  userInfo: User;
  remoteProducerId: string;
  mediaStream: MediaStream;
};

export const useCams = () => {
  const [, setLocalStream] = useRecoilState(streamState);
  const audio = useRecoilValue(audioState);
  const video = useRecoilValue(videoState);
  const socket = useRecoilValue(socketState);
  const user = useRecoilValue(userState);

  const [audioStream, setAudioStream] = useState<Map<string, StreamInfo>>(new Map());
  const [videoStream, setVideoStream] = useState<Map<string, StreamInfo>>(new Map());

  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  let device: Device;
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
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };
  let audioParams: ProducerOptions;
  let videoParams: ProducerOptions = params;
  let producerTransport: Transport;

  let consumingTransports: string[] = [];
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

  const streamSuccess = (stream: MediaStream) => {
    setLocalStream(stream);
    setVideoStream(current => {
      const newStreamMap = new Map(current);
      if (user) newStreamMap.set(user.email, { userInfo: user, remoteProducerId: "", mediaStream: stream });
      return newStreamMap;
    });

    stream.getAudioTracks()[0].enabled = audio;
    stream.getVideoTracks()[0].enabled = video;

    audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
    videoParams = { track: stream.getVideoTracks()[0], ...videoParams };

    joinRoom();
  };

  const joinRoom = () => {
    socket.emit("media/joinRoom", { roomId }, (data: { rtpCapabilities: RtpCapabilities }) => {
      createDevice(data.rtpCapabilities);
    });
  };

  const createDevice = async (rtpCapabilities: RtpCapabilities) => {
    try {
      device = new Device();

      await device.load({
        routerRtpCapabilities: rtpCapabilities,
      });
      createSendTransport();
    } catch (err) {
      console.log(err);
    }
  };

  const createSendTransport = async () => {
    socket.emit("media/createWebRtcTransport", { consumer: false }, (transportOptions: TransportOptions) => {
      producerTransport = device.createSendTransport(transportOptions);
      handleCreateProducerTransport();
    });
  };

  const handleCreateProducerTransport = () => {
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
          ({ id, producersExist }: { id: string; producersExist: boolean }) => {
            cb({ id });
            if (producersExist) getProducers();
          }
        );
      } catch (error: any) {
        eb(error);
      }
    });

    connectSendTransport();
  };

  const connectSendTransport = async () => {
    let audioProducer = await producerTransport.produce(audioParams);
    let videoProducer = await producerTransport.produce(videoParams);

    audioProducer.on("trackended", () => {});

    audioProducer.on("transportclose", () => {});

    videoProducer.on("trackended", () => {});

    videoProducer.on("transportclose", () => {});
  };

  const getProducers = () => {
    socket.emit("media/getProducers", async (producerList: { producerId: string; userInfo: User }[]) => {
      producerList.forEach(producerData => {
        signalNewConsumerTransport(producerData.producerId, producerData.userInfo);
      });
    });
  };

  const signalNewConsumerTransport = async (remoteProducerId: string, userInfo: User) => {
    if (consumingTransports.includes(remoteProducerId)) return;
    consumingTransports.push(remoteProducerId);

    await socket.emit("media/createWebRtcTransport", { consumer: true }, (transportOptions: TransportOptions) => {
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
        connectRecvTransport(consumerTransport, remoteProducerId, transportOptions.id, userInfo);
      } catch (err) {
        console.log(err);
        return;
      }
    });
  };

  const connectRecvTransport = (
    consumerTransport: Transport,
    remoteProducerId: string,
    serverConsumerTransportId: string,
    userInfo: User
  ) => {
    socket.emit(
      "media/consume",
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async (params: {
        id: string;
        producerId: string;
        kind: MediaKind;
        rtpParameters: RtpParameters;
        serverConsumerId: string;
      }) => {
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

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
        if (params.kind === "video") {
          addCam(remoteProducerId, userInfo, new MediaStream([track]));
        } else {
          addAudio(remoteProducerId, userInfo, new MediaStream([track]));
        }

        socket.emit("media/consumer-resume", { serverConsumerId: params.serverConsumerId });
      }
    );
  };

  const addCam = (remoteProducerId: string, userInfo: User, mediaStream: MediaStream) => {
    setVideoStream(current => new Map(current).set(userInfo.email, { userInfo, remoteProducerId, mediaStream }));
  };

  const addAudio = (remoteProducerId: string, userInfo: User, mediaStream: MediaStream) => {
    setAudioStream(current => new Map(current).set(userInfo.email, { userInfo, remoteProducerId, mediaStream }));
  };

  useEffect(() => {
    getLocalStream();
    socket.on("media/new-producer", ({ producerId, userInfo }) => {
      signalNewConsumerTransport(producerId, userInfo);
    });
    socket.on("media/producer-closed", (remoteProducerId: string) => {
      const producerToClose = consumerTransports.find(transportData => transportData.producerId === remoteProducerId);
      producerToClose?.consumerTransport.close();
      producerToClose?.consumer.close();

      setConsumerTransports(current => current.filter(transportData => transportData.producerId !== remoteProducerId));
      setVideoStream(current => {
        const newStreamMap = new Map(current);
        for (const [key, value] of Array.from(newStreamMap.entries())) {
          if (value.remoteProducerId === remoteProducerId) newStreamMap.delete(key);
        }
        return newStreamMap;
      });
      setAudioStream(current => {
        const newStreamMap = new Map(current);
        for (const [key, value] of Array.from(newStreamMap.entries())) {
          if (value.remoteProducerId === remoteProducerId) newStreamMap.delete(key);
        }
        return newStreamMap;
      });
    });
    return () => {
      setVideoStream(current => {
        const newStreamMap = new Map(current);
        if (user) newStreamMap.delete(user.email);
        return newStreamMap;
      });
      socket.off("media/new-producer");
      socket.off("media/producer-closed");
      socket.emit("media/disconnect");
    };
  }, []);

  return { videoStream, audioStream };
};
