import { useState } from "react";
import { CloseButton, Modal } from "react-bootstrap";
import api from "../api";
import Logo from "../assets/logo.png";
import InviteModal from "../components/InviteModal";
import useStore from "../store";
import "./Lobby.css";

const LobbyPage = ({
  setRoom,
  roomPreview,
}: {
  setRoom: (room: string) => void;
  roomPreview?: string;
}) => {
  const [name, setName] = useState("");
  const { setUser } = useStore();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const openInviteModal = () => setIsInviteModalOpen(true);
  const closeInviteModal = () => setIsInviteModalOpen(false);

  const join = async () => {
    if (!roomPreview) return;
    const roomId = await api.getRoom(roomPreview);
    setUser(name);
    setRoom(roomId);
  };

  const create = async () => {
    const roomId = await api.createRoom();
    console.log(roomId);
    setUser(name);
    setRoom(roomId);
  };

  return (
    <div className="lobby">
      <img src={Logo} alt="logo" />
      <div className="lobby-list">
        <input
          id="nickname-input"
          placeholder="Type your nickname"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          maxLength={10}
        />
        {roomPreview && (
          <>
            <div>
              <div>Room: {roomPreview}</div>
            </div>
            <button id="start-button" onClick={join}>
              Join Game
            </button>
          </>
        )}
        {!roomPreview && (
          <>
            <button id="start-button" onClick={create}>
              New Game
            </button>
            <button className="line" onClick={openInviteModal}>
              I have invitation code!
            </button>
          </>
        )}
      </div>
      <Modal show={isInviteModalOpen} onHide={closeInviteModal} centered>
        <CloseButton onClick={closeInviteModal} />
        <InviteModal />
      </Modal>
    </div>
  );
};

export default LobbyPage;
