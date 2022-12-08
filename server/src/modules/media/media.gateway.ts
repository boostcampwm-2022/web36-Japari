import { Inject, Logger, UseFilters } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { SocketBadRequestFilter } from "src/exception-filters/websocket.filter";
import { SERVER_SOCKET_PORT, WEBRTC_HOST } from "src/constants/config";
import { worker } from "src/main";
import {
  Consumer,
  DtlsParameters,
  IceCandidate,
  IceParameters,
  MediaKind,
  Producer,
  Router,
  RtpCapabilities,
  RtpCodecCapability,
  RtpParameters,
  Transport,
  WebRtcTransport,
  WebRtcTransportOptions,
} from "mediasoup/node/lib/types";
import { RedisService } from "../redis/redis.service";
import { RedisTableName } from "src/constants/enum";

const mediaCodecs: RtpCodecCapability[] = [
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
  { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
];

@UseFilters(new SocketBadRequestFilter("media/error"))
@WebSocketGateway(SERVER_SOCKET_PORT, { transports: ["websocket"], namespace: "/" })
export class MediaGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() public server: Server;
  private logger = new Logger("Media Gateway");
  rooms = {};
  peers = {};
  transports = [];
  producers = [];
  consumers = [];

  constructor(private redis: RedisService) {}

  afterInit(server: Server) {
    this.logger.verbose("media gateway initiated");
  }

  @SubscribeMessage("media/joinRoom")
  async handleJoinRoom(@ConnectedSocket() socket: Socket, @MessageBody("roomId") roomId: string) {
    const createRoom = async (roomId: string, socketId: string) => {
      let newRouter: Router;
      let peers = [];
      if (this.rooms[roomId]) {
        newRouter = this.rooms[roomId].router;
        peers = this.rooms[roomId].peers || [];
      } else {
        newRouter = await worker.createRouter({ mediaCodecs });
      }

      this.rooms[roomId] = {
        router: newRouter,
        peers: [...peers, socketId],
      };

      return newRouter;
    };

    const newRouter = await createRoom(roomId, socket.id);
    this.peers[socket.id] = {
      socket,
      roomId,
      transports: [],
      producers: [],
      consumers: [],
      peerDetails: {
        name: "",
      },
    };

    return { rtpCapabilities: newRouter.rtpCapabilities };
  }

  @SubscribeMessage("media/createWebRtcTransport")
  async handleCreateWebRtcTransport(@ConnectedSocket() socket: Socket, @MessageBody("consumer") consumer: boolean) {
    const roomId = this.peers[socket.id].roomId;
    const router = this.rooms[roomId].router;

    let transportOptions: {
      id: string;
      iceParameters: IceParameters;
      iceCandidates: IceCandidate[];
      dtlsParameters: DtlsParameters;
    };
    await this.createWebRtcTransport(router).then(
      (transport: WebRtcTransport) => {
        transportOptions = {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        };

        this.addTransport(transport, roomId, consumer, socket.id);
      },
      error => {
        console.log(error);
      }
    );
    return transportOptions;
  }

  createWebRtcTransport = async (router: Router) => {
    return new Promise(async (resolve, reject) => {
      try {
        const webRtcTransport_options: WebRtcTransportOptions = {
          listenIps: [
            {
              ip: "0.0.0.0",
              announcedIp: WEBRTC_HOST || "127.0.0.1",
            },
          ],
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
        };

        let transport = await router.createWebRtcTransport(webRtcTransport_options);

        transport.on("dtlsstatechange", dtlsState => {
          if (dtlsState === "closed") {
            transport.close();
          }
        });

        resolve(transport);
      } catch (error) {
        reject(error);
      }
    });
  };

  addTransport = (transport: Transport, roomId: string, consumer: boolean, socketId: string) => {
    this.transports = [...this.transports, { socketId, transport, roomId, consumer }];

    this.peers[socketId] = {
      ...this.peers[socketId],
      transports: [...this.peers[socketId].transports, transport.id],
    };
  };

  addProducer = (producer: Producer, roomId: string, socketId: string) => {
    this.producers = [...this.producers, { socketId, producer, roomId }];

    this.peers[socketId] = {
      ...this.peers[socketId],
      producers: [...this.peers[socketId].producers, producer.id],
    };
  };

  addConsumer = (consumer: Consumer, roomId: string, socketId: string) => {
    this.consumers = [...this.consumers, { socketId, consumer, roomId }];

    this.peers[socketId] = {
      ...this.peers[socketId],
      consumers: [...this.peers[socketId].consumers, consumer.id],
    };
  };

  @SubscribeMessage("media/getProducers")
  async handleGetProducers(@ConnectedSocket() socket: Socket) {
    const { roomId } = this.peers[socket.id];

    let producerList = [];
    for (const producerData of this.producers) {
      if (producerData.socketId !== socket.id && producerData.roomId === roomId) {
        const userInfo = JSON.parse(
          await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, producerData.socketId)
        );
        producerList = [...producerList, { producerId: producerData.producer.id, userInfo }];
      }
    }

    return producerList;
  }

  @SubscribeMessage("media/transport-connect")
  async handleTransportConnect(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { dtlsParameters }: { dtlsParameters: DtlsParameters }
  ) {
    this.getTransport(socket.id).connect({ dtlsParameters });
  }

  @SubscribeMessage("media/transport-produce")
  async handleTransportProduce(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    {
      kind,
      rtpParameters,
      appData,
    }: { kind: MediaKind; rtpParameters: RtpParameters; appData: Record<string, unknown> }
  ) {
    const producer = await this.getTransport(socket.id).produce({
      kind,
      rtpParameters,
    });

    const { roomId } = this.peers[socket.id];

    this.addProducer(producer, roomId, socket.id);

    this.informConsumers(roomId, socket.id, producer.id);

    producer.on("transportclose", () => {
      producer.close();
    });

    return { id: producer.id, producersExist: this.producers.length > 1 ? true : false };
  }

  informConsumers = async (roomId: string, socketId: string, producerId: string) => {
    const userInfo = JSON.parse(await this.redis.hget(RedisTableName.SOCKET_ID_TO_USER_INFO, socketId));
    this.producers.forEach(producerData => {
      if (producerData.socketId !== socketId && producerData.roomId === roomId) {
        const producerSocket = this.peers[producerData.socketId].socket;
        producerSocket.emit("media/new-producer", { producerId, userInfo });
      }
    });
  };

  getTransport = (socketId: string) => {
    const [producerTransport] = this.transports.filter(
      transport => transport.socketId === socketId && !transport.consumer
    );
    return producerTransport.transport;
  };

  @SubscribeMessage("media/transport-recv-connect")
  async handleTransportRecvConnect(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    { dtlsParameters, serverConsumerTransportId }: { dtlsParameters: DtlsParameters; serverConsumerTransportId: string }
  ) {
    const consumerTransport = this.transports.find(
      transportData => transportData.consumer && transportData.transport.id == serverConsumerTransportId
    ).transport;
    await consumerTransport.connect({ dtlsParameters });
  }

  @SubscribeMessage("media/consume")
  async handleConsume(
    @ConnectedSocket() socket: Socket,
    @MessageBody()
    {
      rtpCapabilities,
      remoteProducerId,
      serverConsumerTransportId,
    }: { rtpCapabilities: RtpCapabilities; remoteProducerId: string; serverConsumerTransportId: string }
  ) {
    const { roomId } = this.peers[socket.id];
    const router = this.rooms[roomId].router;

    let consumerTransport = this.transports.find(
      transportData => transportData.consumer && transportData.transport.id == serverConsumerTransportId
    ).transport;

    if (
      router.canConsume({
        producerId: remoteProducerId,
        rtpCapabilities,
      })
    ) {
      const consumer = await consumerTransport.consume({
        producerId: remoteProducerId,
        rtpCapabilities,
        paused: true,
      });

      consumer.on("producerclose", () => {
        socket.emit("media/producer-closed", remoteProducerId);
        consumerTransport.close([]);
        this.transports = this.transports.filter(transportData => transportData.transport.id !== consumerTransport.id);
        consumer.close();
        this.consumers = this.consumers.filter(consumerData => consumerData.consumer.id !== consumer.id);
      });

      this.addConsumer(consumer, roomId, socket.id);

      const params = {
        id: consumer.id,
        producerId: remoteProducerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        serverConsumerId: consumer.id,
      };

      return params;
    }
  }

  @SubscribeMessage("media/consumer-resume")
  async handleConsumerResume(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { serverConsumerId }: { serverConsumerId: string }
  ) {
    const { consumer } = this.consumers.find(consumerData => consumerData.consumer.id === serverConsumerId);
    await consumer.resume();
  }

  @SubscribeMessage("media/disconnect")
  handleMediaDisconnect(@ConnectedSocket() socket: Socket) {
    const removeItems = (items: any[], socketId: string, type: string) => {
      items.forEach(item => {
        if (item.socketId === socket.id) {
          item[type].close();
        }
      });
      items = items.filter(item => item.socketId !== socket.id);
      return items;
    };

    this.consumers = removeItems(this.consumers, socket.id, "consumer");
    this.producers = removeItems(this.producers, socket.id, "producer");
    this.transports = removeItems(this.transports, socket.id, "transport");

    if (this.peers[socket.id]) {
      const { roomId } = this.peers[socket.id];
      delete this.peers[socket.id];

      this.rooms[roomId] = {
        router: this.rooms[roomId].router,
        peers: this.rooms[roomId].peers.filter(socketId => socketId !== socket.id),
      };
    }
  }

  handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
