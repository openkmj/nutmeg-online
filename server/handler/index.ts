import { Socket } from "socket.io";
import {
  ActionPayload,
  ChatPayload,
  GameStatus,
  JoinPayload,
  S2CEventType,
  StartPayload,
  SyncPayload,
} from "../../model/event";
import roomManager from "../module/RoomManager";
import socketManager from "../module/SocketManager";

const getRoomIdFromSocket = (s: Socket) => {
  let room = "";
  for (let i of s.rooms) room = i;
  if (!room) return null;
  return room;
};

const getJoinHandler = (socket: Socket) => (payload: JoinPayload) => {
  if (!payload.roomId) return;
  const roomId = roomManager.joinRoom(payload.roomId, payload.member);
  if (!roomId) return;
  console.log(
    "join room: ",
    payload.roomId,
    payload.member.id,
    payload.member.name
  );
  socket.join(roomId);
  socketManager.emitEvent({
    roomId: roomId,
    type: S2CEventType.CHATTING_UPDATED,
    payload: {
      type: "SYS",
      text: `${payload.member.name} has joined`,
    },
  });
  const room = roomManager.getRoom(roomId);
  if (!room) return;
  socketManager.emitEvent({
    roomId: roomId,
    type: S2CEventType.MEMBER_UPDATED,
    payload: {
      members: room.members,
    },
  });
};
const getChatHandler = (socket: Socket) => (payload: ChatPayload) => {
  let roomId = getRoomIdFromSocket(socket);
  if (!roomId) return;
  socketManager.emitEvent({
    roomId: roomId,
    type: S2CEventType.CHATTING_UPDATED,
    payload: {
      type: "USR",
      member: payload.member,
      text: payload.text,
    },
  });
};
const getStartHandler = (socket: Socket) => (payload: StartPayload) => {
  let roomId = getRoomIdFromSocket(socket);
  if (!roomId) return;
  const room = roomManager.getRoom(roomId);
  if (!room) return;
  room.start();
  socketManager.emitEvent({
    roomId: roomId,
    type: S2CEventType.STATUS_UPDATED,
    payload: {
      status: room.status,
    },
  });
};
const getActionHandler = (socket: Socket) => (payload: ActionPayload) => {
  let roomId = getRoomIdFromSocket(socket);
  if (!roomId) return;
  socketManager.emitEvent({
    roomId: roomId,
    type: S2CEventType.SCENE_UPDATED,
    payload: payload,
  });
};
const getSyncHandler = (socket: Socket) => (payload: SyncPayload) => {
  let roomId = getRoomIdFromSocket(socket);
  if (!roomId) return;
  const room = roomManager.getRoom(roomId);
  if (!room) return;
  if (payload.result) {
    room.end();
    socketManager.emitEvent({
      roomId: roomId,
      type: S2CEventType.STATUS_UPDATED,
      payload: {
        status: GameStatus.PENDING,
        winner: payload.result,
      },
    });
  } else {
    room.next();
    socketManager.emitEvent({
      roomId: roomId,
      type: S2CEventType.STATUS_UPDATED,
      payload: {
        status: room.status,
      },
    });
    socketManager.emitEvent({
      roomId: roomId,
      type: S2CEventType.CHATTING_UPDATED,
      payload: {
        type: "SYS",
        text:
          room.status === GameStatus.PLAYER1TURN
            ? "Player1's Turn!"
            : "Player2's Turn!",
      },
    });
  }
};
const getDisconnectHandler = (socket: Socket) => () => {
  let roomId = getRoomIdFromSocket(socket);
  if (!roomId) return;
  const room = roomManager.getRoom(roomId);
  if (!room) return;
  console.log(socket.id);

  room.leave(socket.id);

  socketManager.emitEvent({
    roomId: roomId,
    type: S2CEventType.MEMBER_UPDATED,
    payload: {
      members: room.members,
    },
  });
};

export {
  getActionHandler,
  getChatHandler,
  getDisconnectHandler,
  getJoinHandler,
  getStartHandler,
  getSyncHandler,
};
