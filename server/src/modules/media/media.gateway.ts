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
import { SERVER_SOCKET_PORT } from "src/constants/config";
import { worker } from "src/main";
import {
  Consumer,
  DtlsParameters,
  MediaKind,
  Producer,
  Router,
  RtpCodecCapability,
  RtpParameters,
  Transport,
  WebRtcTransport,
} from "mediasoup/node/lib/types";
import { RedisService } from "../redis/redis.service";

const mediaCodecs: RtpCodecCapability[] = [
  { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
  {
    kind: "video",
    mimeType: "video/VP8",
    clockRate: 90000,
    parameters: {
      "x-google-start-bitrate": 1000,
    },
  },
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

    socket.emit("media/joinRoom-success", { rtpCapabilities: newRouter.rtpCapabilities });
  }

  @SubscribeMessage("media/createWebRtcTransport")
  async handleCreateWebRtcTransport(@ConnectedSocket() socket: Socket, @MessageBody("consumer") consumer: boolean) {
    const roomId = this.peers[socket.id].roomId;
    const router = this.rooms[roomId].router;

    this.createWebRtcTransport(router).then(
      (transport: WebRtcTransport) => {
        const params = {
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        };

        socket.emit("media/createWebRtcTransport-success", params);
        this.addTransport(transport, roomId, consumer, socket.id);
      },
      error => {
        console.log(error);
      }
    );
  }

  createWebRtcTransport = async (router: Router) => {
    return new Promise(async (resolve, reject) => {
      try {
        // https://mediasoup.org/documentation/v3/mediasoup/api/#WebRtcTransportOptions
        const webRtcTransport_options = {
          listenIps: [
            {
              ip: "127.0.0.1", // replace with relevant IP address
              announcedIp: "0.0.0.0",
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
    this.producers.forEach(producerData => {
      if (producerData.socketId !== socket.id && producerData.roomId === roomId)
        producerList = [...producerList, producerData.producer.id];
    });

    socket.emit("media/getProduces-success", producerList);
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
    @MessageBody() body: { kind: MediaKind; rtpCapabilities: RtpParameters; appData: Record<string, unknown> },
    callback: Function
  ) {
    const producer = await this.getTransport(socket.id).produce({
      kind: body.kind,
      rtpCapabilities: body.rtpCapabilities,
    });

    const { roomId } = this.peers[socket.id];
    this.addProducer(producer, roomId, socket.id);

    this.informConsumers(roomId, socket.id, producer.id);

    producer.on("transportclose", () => {
      producer.close();
    });

    // socket.emit("media/transport-produce-success", {
    //   id: producer.id,
    //   producersExist: this.producers.length > 1 ? true : false,
    // });
    console.log(callback);
    callback({ id: producer.id, producersExist: this.producers.length > 1 ? true : false });
  }

  informConsumers = (roomId: string, socketId: string, producerId: string) => {
    this.producers.forEach(producerData => {
      if (producerData.socketId !== socketId && producerData.roomName === roomId) {
        const producerSocket = this.peers[producerData.socketId].socket;
        producerSocket.emit("media/new-producer", { producerId: producerId });
      }
    });
  };

  getTransport = (socketId: string) => {
    const [producerTransport] = this.transports.filter(
      transport => transport.socketId === socketId && !transport.consumer
    );
    return producerTransport.transport;
  };

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
    const { roomId } = this.peers[socket.id];
    delete this.peers[socket.id];
    this.rooms[roomId] = {
      router: this.rooms[roomId].router,
      peers: this.rooms[roomId].peers.filter(socketId => socketId !== socket.id),
    };
  }

  handleConnection(@ConnectedSocket() socket: Socket) {}

  handleDisconnect(@ConnectedSocket() socket: Socket) {}
}
