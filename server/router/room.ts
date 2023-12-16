import { Router } from "express";
import { createRoom, getRoom } from "../controller";

const room = Router();

room.get("/:id", getRoom);
room.post("/", createRoom);

export default room;
