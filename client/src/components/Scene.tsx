import { forwardRef, useEffect, useRef } from "react";
import SceneManager from "../module/SceneManager";

const Scene = forwardRef(
  (
    {
      is1P,
      dragCallback,
      actionCallback,
    }: {
      is1P: boolean;
      dragCallback: (
        startPosition: { x: number; y: number },
        endPosition: { x: number; y: number }
      ) => void;
      actionCallback: (
        label: string,
        startPosition: { x: number; y: number },
        endPosition: { x: number; y: number }
      ) => void;
    },
    ref
  ) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
      if (!containerRef.current || !canvasRef.current) return;

      //@ts-ignore
      ref.current = new SceneManager(
        containerRef.current,
        canvasRef.current,
        dragCallback,
        actionCallback,
        is1P ? "black" : "white"
      );
    }, []);

    // useEffect(() => {
    //   if (isMyTurn) {
    //     setTimeout(() => sceneManager.current?.enableAction());
    //   } else {
    //     setTimeout(() => sceneManager.current?.disableAction());
    //   }
    // }, [isMyTurn]);
    return (
      <div ref={containerRef} style={{ width: 600, height: 600 }}>
        <canvas ref={canvasRef} />
      </div>
    );
  }
);

export default Scene;
