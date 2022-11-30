export class WebsocketException {
  constructor(public eventName: string, public message: string) {}
}
