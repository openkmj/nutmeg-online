import { Request, Response } from "express";
import roomManager from "../module/RoomManager";

const getRoom = (req: Request, res: Response) => {
  if (!req.params.id) return res.status(404).json();
  const room = roomManager.getRoom(req.params.id);
  if (!room) return res.status(404).json();
  return res.json({
    id: room.id,
  });
};

const createRoom = (req: Request, res: Response) => {
  const roomId = roomManager.createRoom();
  return res.json({ id: roomId });
};

export { createRoom, getRoom };
