import { useEffect, useRef, useState } from "react";
import {
  C2SEventType,
  ChattingUpdatedPayload,
  GameStatus,
  MemberUpdatedPayload,
  S2CEventType,
  SceneUpdatedPayload,
  StatusUpdatedPayload,
} from "../../../model/event";
import Scene from "../components/Scene";
import GameManager from "../module/GameManager";
import SceneManager from "../module/SceneManager";
import useStore from "../store";
import "./Game.css";

const GamePage = ({ room }: { room: string }) => {
  const { user } = useStore();
  const [chatInput, setChatInput] = useState("");
  const [chatList, setChatList] = useState<
    {
      type: "SYS" | "USR";
      speaker: { id: string; name: string };
      text: string;
    }[]
  >([]);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.PENDING);
  const [isBlock, setIsBlock] = useState(false);
  const gameManagerRef = useRef<GameManager>();
  const sceneManagerRef = useRef<SceneManager>();
  const chatListRef = useRef<HTMLDivElement>(null);
  const memberRef = useRef<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (gameManagerRef.current) return;
    gameManagerRef.current = new GameManager(room, user);
    gameManagerRef.current.connect();
    gameManagerRef.current.addEventListener(
      S2CEventType.CHATTING_UPDATED,
      (p: ChattingUpdatedPayload) => {
        setChatList((i) =>
          i.concat({
            type: p.type,
            speaker:
              p.type === "SYS" ? { id: "SYS", name: "System" } : p.member,
            text: p.text,
          })
        );
      }
    );
    gameManagerRef.current.addEventListener(
      S2CEventType.MEMBER_UPDATED,
      (p: MemberUpdatedPayload) => {
        setMembers(p.members);
        memberRef.current = p.members;
      }
    );
    gameManagerRef.current.addEventListener(
      S2CEventType.STATUS_UPDATED,
      (p: StatusUpdatedPayload) => {
        setStatus(p.status);
        if (p.winner) {
          if (
            (p.winner === "PLAYER1" && memberRef.current[0].id === user.id) ||
            (p.winner === "PLAYER2" && memberRef.current[1].id === user.id)
          ) {
            // i win
            alert("You Win!");
          } else {
            // i lose
            alert("You lose!");
          }
        }
      }
    );
    gameManagerRef.current.addEventListener(
      S2CEventType.SCENE_UPDATED,
      (p: SceneUpdatedPayload) => {
        if (p.type === "MOVE") {
          console.log(p);
          sceneManagerRef.current?.hit(p.label, p.startPosition, p.endPosition);
          sceneManagerRef.current?.clearIndicator();
        } else if (p.type === "DRAG") {
          sceneManagerRef.current?.setIndicator(p.startPosition, p.endPosition);
        }
      }
    );
  }, [room, user, members]);

  useEffect(() => {
    setTimeout(() => {
      chatListRef.current?.scrollBy({
        top: 99999,
        behavior: "smooth",
      });
    }, 100);
  }, [chatList]);

  useEffect(() => {
    setIsBlock(
      (status === GameStatus.PLAYER1TURN && members[0].id !== user.id) ||
        (status === GameStatus.PLAYER2TURN && members[1].id !== user.id)
    );
  }, [status, members, user]);

  const sendChat = () => {
    if (!chatInput || !chatInput.trim() || !gameManagerRef.current) return;
    gameManagerRef.current.emitEvent({
      roomId: room,
      type: C2SEventType.CHAT,
      payload: {
        type: "USR",
        member: user,
        text: chatInput,
      },
    });
    setChatInput("");
  };
  const startGame = () => {
    if (!gameManagerRef.current) return;
    if (members.length < 2) {
      alert("Wait For Your Friends");
      return;
    }
    gameManagerRef.current.emitEvent({
      roomId: room,
      type: C2SEventType.START,
      payload: {},
    });
  };

  const actionCallback = (
    label: string,
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number }
  ) => {
    if (!gameManagerRef.current) return;
    gameManagerRef.current.emitEvent({
      roomId: room,
      type: C2SEventType.ACTION,
      payload: {
        label,
        type: "MOVE",
        startPosition,
        endPosition,
      },
    });
    setIsBlock(true);
    setTimeout(() => {
      if (!sceneManagerRef.current) return;
      const winner = sceneManagerRef.current.whoIsWinner();
      if (!gameManagerRef.current) return;
      gameManagerRef.current.emitEvent({
        roomId: room,
        type: C2SEventType.SYNC,
        payload: {
          result:
            winner === "black"
              ? "PLAYER1"
              : winner === "white"
              ? "PLAYER2"
              : undefined,
          data: {},
          // data:sceneManagerRef.current.stones
        },
      });
    }, 2000);
  };
  const dragCallback = (
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number }
  ) => {
    if (!gameManagerRef.current) return;
    gameManagerRef.current.emitEvent({
      roomId: room,
      type: C2SEventType.ACTION,
      payload: {
        type: "DRAG",
        startPosition,
        endPosition,
      },
    });
  };

  return (
    <div className="game">
      <div className="screen-section">
        {status !== GameStatus.PENDING ? (
          <Scene
            ref={sceneManagerRef}
            is1P={members[0]?.id === user.id}
            dragCallback={dragCallback}
            actionCallback={actionCallback}
          />
        ) : (
          <>
            {user?.id === members[0]?.id ? (
              <button onClick={startGame}>Start Game</button>
            ) : (
              <div>Wait for start...</div>
            )}
          </>
        )}
        {isBlock ? <div className="block"></div> : <></>}
      </div>
      <div className="data-section">
        <div>Room Code: {room}</div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Player1</th>
                <th>Player2</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{members[0]?.name}</td>
                <td>{members[1]?.name}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="chat">
          <div className="chat-list" ref={chatListRef}>
            {chatList.map((i, idx) => (
              <div
                className={
                  i.type === "SYS"
                    ? "chat-list-item system"
                    : user.id === i.speaker.id
                    ? "chat-list-item mine"
                    : "chat-list-item"
                }
                key={idx}
              >
                <div className="speaker">{i.speaker.name}</div>
                <div className="text">{i.text}</div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              placeholder="Type here"
              maxLength={100}
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  sendChat();
                }
              }}
            />
            <button onClick={sendChat}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
