require("dotenv").config();
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import socketManager from "./module/SocketManager";
import router from "./router";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));
app.use(router);

const server = app.listen(process.env.PORT || 80, () => {
  console.log("Server Start");
});

socketManager.init(server);
