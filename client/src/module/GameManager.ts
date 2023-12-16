import { Socket, io } from "socket.io-client";
import { C2SEvent, S2CEventType } from "../../../model/event";
import Member from "../class/member";

const SOCKET_SERVER_URL = import.meta.env.VITE_SERVER_URL as string;

export default class GameManager {
  roomId: string;
  socket: Socket;

  constructor(roomId: string, member: Member) {
    this.roomId = roomId;
    this.socket = io(SOCKET_SERVER_URL);

    this.socket.on("connect", () => {
      console.log("connection created");
      this.socket.emit("JOIN", {
        roomId: this.roomId,
        member: member,
      });
    });
  }

  connect() {
    this.socket.connect();
  }
  disconnect() {
    if (!this.socket.connected) return;
    this.socket.disconnect();
  }
  addEventListener(type: S2CEventType, callback: (params: any) => void) {
    this.socket.on(type, callback);
  }
  emitEvent(event: C2SEvent) {
    if (!this.socket.connected) return;
    this.socket.emit(event.type, event.payload);
    console.log(event.type, event.payload);
  }
}
