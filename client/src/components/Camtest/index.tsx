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
import Audio from "../Audio";
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

  const [remoteAudioStream, setRemoteAudioStream] = useState<Map<string, MediaStream>>(new Map());
  const [remoteVideoStream, setRemoteVideoStream] = useState<Map<string, MediaStream>>(new Map());

  const location = useLocation();
  const roomId = location.pathname.split("/").slice(-1)[0];

  const [audios, setAudios] = useState<string[]>([]);
  const [cams, setCams] = useState<{ userInfo: User; remoteProducerId: string }[]>([]);
  // const localVideoRef = useRef<HTMLVideoElement | null>(null);
  // const remoteVideoRef = useRef<HTMLVideoElement[]>([]);

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
  // const [consumingTransports, setConsumingTransports] = useState<string[]>([]);
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

    audioProducer.on("trackended", () => {
      console.log("audio track ended");
      // close audio track
    });

    audioProducer.on("transportclose", () => {
      console.log("audio transport ended");
      // close audio track
    });

    videoProducer.on("trackended", () => {
      console.log("video track ended");
      // close video track
    });

    videoProducer.on("transportclose", () => {
      console.log("video transport ended");
      // close video track
    });
  };

  const getProducers = () => {
    socket.emit("media/getProducers", (producerList: { producerId: string; userInfo: User }[]) => {
      producerList.forEach(producerData => {
        signalNewConsumerTransport(producerData.producerId, producerData.userInfo);
      });
    });
  };

  const signalNewConsumerTransport = async (remoteProducerId: string, userInfo: User) => {
    if (consumingTransports.includes(remoteProducerId)) return;
    // setConsumingTransports(current => [...current, remoteProducerId]);
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

  const addCam = (remoteProducerId: string, userInfo: User, newMediaStream: MediaStream) => {
    setRemoteVideoStream(current => new Map(current).set(remoteProducerId, newMediaStream));

    setCams(current => [
      ...current,
      {
        userInfo,
        remoteProducerId,
      },
    ]);
  };

  const addAudio = (remoteProducerId: string, userInfo: User, newMediaStream: MediaStream) => {
    setRemoteAudioStream(current => new Map(current).set(remoteProducerId, newMediaStream));

    setAudios(current => [...current, remoteProducerId]);
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
      setAudios(current => current.filter(audio => audio !== remoteProducerId));
      setRemoteVideoStream(current => {
        const newRemoteStream = new Map(current);
        newRemoteStream.delete(remoteProducerId);
        return newRemoteStream;
      });
      setRemoteAudioStream(current => {
        const newRemoteAudioStream = new Map(current);
        newRemoteAudioStream.delete(remoteProducerId);
        return newRemoteAudioStream;
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
        return (
          <Fragment key={cam.remoteProducerId}>
            <Cam
              mediaStream={remoteVideoStream.get(cam.remoteProducerId) ?? null}
              isVideoOn={true}
              isAudioOn={true}
              profile={cam.userInfo.profileImage}
              nickname={cam.userInfo.nickname}
            />
          </Fragment>
        );
      })}
      <div>
        {audios.map(audio => {
          return <Audio key={audio} mediaStream={remoteAudioStream.get(audio) ?? null} />;
        })}
      </div>
    </div>
  );
};

export default Camtest;
