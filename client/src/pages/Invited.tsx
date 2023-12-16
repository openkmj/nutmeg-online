import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import api from "../api";
import GamePage from "./Game";
import LobbyPage from "./Lobby";

export const InvitedPageLoader = async ({ params }: { params: any }) => {
  try {
    const roomId = await api.getRoom(params.id);
    return roomId;
  } catch (e) {
    throw new Response("No Such Room: Check your invitation code.", {
      status: 404,
      statusText: "Room Not Found",
    });
  }
};

const InvitedPage = () => {
  const [room, setRoom] = useState("");
  const roomPreview = useLoaderData() as string;

  if (room) return <GamePage room={room} />;
  else return <LobbyPage setRoom={setRoom} roomPreview={roomPreview} />;
};

export default InvitedPage;
