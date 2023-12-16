import { useState } from "react";
import GamePage from "./Game";
import LobbyPage from "./Lobby";

const MainPage = () => {
  const [room, setRoom] = useState("");

  if (room) return <GamePage room={room} />;
  else return <LobbyPage setRoom={setRoom} />;
};

export default MainPage;
