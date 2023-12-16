import { GameStatus } from "../../model/event";

interface RoomTable {
  [key: string]: Room;
}
interface RoomMember {
  id: string;
  name: string;
}

class Room {
  id: string;
  members: RoomMember[];
  status: GameStatus;
  constructor(id: string) {
    this.id = id;
    this.members = [];
    this.status = GameStatus.PENDING;
  }
  join(member: RoomMember) {
    this.members.push(member);
  }
  leave(mid: string) {
    this.members = this.members.filter((m) => m.id !== mid);
  }
  start() {
    if (this.status !== GameStatus.PENDING) return;
    this.status = GameStatus.PLAYER1TURN;
  }
  next() {
    if (this.status === GameStatus.PLAYER1TURN)
      this.status = GameStatus.PLAYER2TURN;
    else if (this.status === GameStatus.PLAYER2TURN)
      this.status = GameStatus.PLAYER1TURN;
  }
  end() {
    this.status = GameStatus.PENDING;
  }
}

class RoomManager {
  private roomTable: RoomTable;
  constructor() {
    this.roomTable = {};
  }
  getRoom(id: string) {
    if (!this.roomTable[id]) return null;
    return this.roomTable[id];
  }
  hasRoom(id: string) {
    if (this.roomTable[id]) return true;
    return false;
  }
  createRoom() {
    let id = Math.random().toString(36).substring(2, 8);
    while (this.roomTable[id]) {
      // TODO
      id = Math.random().toString(36).substring(2, 8);
    }
    this.roomTable[id] = new Room(id);
    return id;
  }
  joinRoom(id: string, member: RoomMember) {
    if (!this.roomTable[id]) return null;
    this.roomTable[id].join(member);
    return id;
  }
}

const roomManager = new RoomManager();

export default roomManager;
