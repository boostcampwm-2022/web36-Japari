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
import { Router, RtpCodecCapability, Transport, WebRtcTransport } from "mediasoup/node/lib/types";
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
        socket.emit("media/createWebRtcTransport-success", {
          params: {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
          },
        });
        this.addTransport(transport, roomId, consumer);
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
  addTransport = (transport: Transport, roomId: string, consumer: boolean) => {};
  addProducer = () => {};
  addConsumer = () => {};

  async handleConnection(@ConnectedSocket() socket: Socket) {}

  @SubscribeMessage("media/disconnect")
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    // const removeItems = (items: any[], socketId: string, type: string) => {
    //   items.forEach(item => {
    //     if (item.socketId === socket.id) {
    //       item[type].close();
    //     }
    //   });
    //   items = items.filter(item => item.socketId !== socket.id);
    //   return items;
    // };
    // this.consumers = removeItems(this.consumers, socket.id, "consumer");
    // this.producers = removeItems(this.producers, socket.id, "producer");
    // this.transports = removeItems(this.transports, socket.id, "transport");
    // const { roomId } = this.peers[socket.id];
    // delete this.peers[socket.id];
    // this.rooms[roomId] = {
    //   router: this.rooms[roomId].router,
    //   peers: this.rooms[roomId].peers.filter(socketId => socketId !== socket.id),
    // };
  }
}
