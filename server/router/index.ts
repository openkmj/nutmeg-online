import { Router } from "express";
import room from "./room";

const router = Router();
router.use("/room", room);

router.get("/", (req, res) => {
  res.status(200).send("OK");
});

export default router;
