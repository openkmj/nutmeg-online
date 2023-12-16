import { Server } from "socket.io";
import { C2SEventType, S2CEvent } from "../../model/event";
import {
  getActionHandler,
  getChatHandler,
  getDisconnectHandler,
  getJoinHandler,
  getStartHandler,
  getSyncHandler,
} from "../handler";

class SocketManager {
  io: Server | null;
  constructor() {
    this.io = null;
  }
  init(server: any) {
    this.io = new Server(server, { cors: { origin: "*" } });
    this.io.on("connection", (socket) => {
      socket.on(C2SEventType.JOIN, getJoinHandler(socket));
      socket.on(C2SEventType.CHAT, getChatHandler(socket));
      socket.on(C2SEventType.START, getStartHandler(socket));
      socket.on(C2SEventType.SYNC, getSyncHandler(socket));
      socket.on(C2SEventType.ACTION, getActionHandler(socket));
      socket.on("disconnect", getDisconnectHandler(socket));
    });
  }
  emitEvent(event: S2CEvent) {
    if (!this.io) return;
    this.io.in(event.roomId).emit(event.type, event.payload);
    console.log(event.type, event.payload);
  }
}

const socketManager = new SocketManager();

export default socketManager;
