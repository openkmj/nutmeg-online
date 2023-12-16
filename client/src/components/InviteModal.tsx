import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InviteModal.css";

const InviteModal = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  return (
    <div className="invite-modal">
      <div>
        If you have invitation code,
        <div className="highlight">Enter the invitation code</div>
      </div>
      <input
        placeholder="Type your code"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
        maxLength={6}
      ></input>
      <button
        onClick={() => {
          if (!code) return;
          navigate(`/${code}`);
        }}
      >
        Enter
      </button>
    </div>
  );
};

export default InviteModal;
