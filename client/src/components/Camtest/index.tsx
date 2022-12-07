/** @jsxImportSource @emotion/react */
import { User } from "@dto";
import { Device } from "mediasoup-client";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/Consumer";
import { ProducerOptions } from "mediasoup-client/lib/Producer";
import { MediaKind, RtpCapabilities, RtpParameters } from "mediasoup-client/lib/RtpParameters";
import { Transport, TransportOptions } from "mediasoup-client/lib/Transport";
import { Fragment, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { socketState } from "../../store/socket";
import { userState } from "../../store/user";
import { audioState, videoState, streamState } from "./../../store/media";
import Cam from "../Cam";
import * as style from "./styles";

type ConsumerTransport = {
  consumerTransport: Transport;
  serverConsumerTransportId?: string;
  producerId: string;
  consumer: Consumer;
};

const Camtest = () => {
  const [localStream, setLocalStream] = useRecoilState(streamState);
  const audio = useRecoilValue(audioState);
  const video = useRecoilValue(videoState);
  const socket = useRecoilValue(socketState);
  const user = useRecoilValue(userState);

  const [remoteStream, setRemoteStream] = useState<Map<string, MediaStream>>(new Map());

  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  const [cams, setCams] = useState<any[]>([]);
  // const localVideoRef = useRef<HTMLVideoElement | null>(null);
  // const remoteVideoRef = useRef<HTMLVideoElement[]>([]);

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
  let rtpCapabilites: RtpCapabilities;
  const [device, setDevice] = useState<Device>(new Device());
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

    stream.getAudioTracks()[0].enabled = audio;
    stream.getVideoTracks()[0].enabled = video;

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
    socket.emit("media/getProducers", (producerList: { producerId: string; userInfo: User }[]) => {
      producerList.forEach(producerData => {
        signalNewConsumerTransport(producerData.producerId, producerData.userInfo);
      });
    });
  };

  const signalNewConsumerTransport = async (remoteProducerId: string, userInfo: User) => {
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
        addCam(remoteProducerId, userInfo, track);

        socket.emit("media/consumer-resume", { serverConsumerId: params.serverConsumerId });
      }
    );
  };

  const addCam = (remoteProducerId: string, userInfo: User, track: MediaStreamTrack) => {
    setRemoteStream(current => new Map(current).set(remoteProducerId, new MediaStream([track])));

    setCams(current => [
      ...current,
      {
        userInfo,
        remoteProducerId,
      },
    ]);
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
      setCams(current => current.filter(cam => cam.remoteProducerId !== remoteProducerId));
      setRemoteStream(current => {
        const newRemoteStream = new Map(current);
        newRemoteStream.delete(remoteProducerId);
        return newRemoteStream;
      });
    });
    return () => {
      socket.off("media/new-producer");
      socket.off("media/producer-closed");
      socket.emit("media/disconnect");
    };
  }, []);

  return (
    <div css={style.CamsContainerStyle}>
      {user && (
        <Cam
          mediaStream={localStream}
          isVideoOn={true}
          isAudioOn={true}
          profile={user.profileImage}
          nickname={user.nickname}
        />
      )}
      {cams.map((cam, idx) => {
        console.log(cam.userInfo);
        return (
          <Fragment key={idx}>
            <Cam
              mediaStream={remoteStream.get(cam.remoteProducerId) ?? null}
              isVideoOn={true}
              isAudioOn={true}
              profile={cam.userInfo.profileImage}
              nickname={cam.userInfo.nickname}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default Camtest;
