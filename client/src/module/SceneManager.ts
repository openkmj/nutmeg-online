import {
  Bodies,
  Body,
  Bounds,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  Vector,
  World,
} from "matter-js";

let timer: number | null = null;

class SceneManager {
  selectedStone: Body | null = null;
  startPosition: { x: number; y: number } | null = null;
  isDragging = false;
  stones: Body[];
  myStones: Body[];
  dragCallback: any;
  actionCallback: any;
  indicator: {
    startPosition: { x: number; y: number };
    endPosition: { x: number; y: number };
  } | null;

  constructor(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    dragCallback: (
      startPosition: { x: number; y: number },
      endPosition: { x: number; y: number }
    ) => void,
    actionCallback: (
      label: string,
      startPosition: { x: number; y: number },
      endPosition: { x: number; y: number }
    ) => void,
    player: "black" | "white"
  ) {
    this.indicator = null;
    this.stones = [];
    this.myStones = [];
    this.init(container, canvas, dragCallback, actionCallback, player);
  }
  init(
    container: HTMLElement,
    canvas: HTMLCanvasElement,
    dragCallback: (
      startPosition: { x: number; y: number },
      endPosition: { x: number; y: number }
    ) => void,
    actionCallback: (
      label: string,
      startPosition: { x: number; y: number },
      endPosition: { x: number; y: number }
    ) => void,
    player: "black" | "white"
  ) {
    this.dragCallback = dragCallback;
    this.actionCallback = actionCallback;
    const engine = Engine.create({ gravity: { y: 0 } });
    const render = Render.create({
      element: container,
      engine: engine,
      canvas: canvas,
      options: {
        width: 600,
        height: 600,
        background: "skyblue",
        wireframes: false,
      },
    });

    const blackStones = [
      Bodies.circle(200, 400, 20, {
        restitution: 0.5,
        frictionAir: 0.1,
        label: "stoneb1",
        render: { fillStyle: "black" },
      }),
      Bodies.circle(300, 400, 20, {
        restitution: 0.5,
        frictionAir: 0.1,
        label: "stoneb2",
        render: { fillStyle: "black" },
      }),
      Bodies.circle(400, 400, 20, {
        restitution: 0.5,
        frictionAir: 0.1,
        label: "stoneb3",
        render: { fillStyle: "black" },
      }),
    ];
    const whiteStones = [
      Bodies.circle(200, 200, 20, {
        restitution: 0.5,
        frictionAir: 0.1,
        label: "stonew1",
        render: { fillStyle: "white" },
      }),
      Bodies.circle(300, 200, 20, {
        restitution: 0.5,
        frictionAir: 0.1,
        label: "stonew2",
        render: { fillStyle: "white" },
      }),
      Bodies.circle(400, 200, 20, {
        restitution: 0.5,
        frictionAir: 0.1,
        label: "stonew3",
        render: { fillStyle: "white" },
      }),
    ];

    this.stones = blackStones.concat(whiteStones);
    this.myStones = player === "black" ? blackStones : whiteStones;

    const walls = [
      Bodies.rectangle(300, 0, 600, 100, { isStatic: true, label: "wall" }),
      Bodies.rectangle(300, 600, 600, 100, { isStatic: true, label: "wall" }),
      Bodies.rectangle(600, 300, 100, 600, { isStatic: true, label: "wall" }),
      Bodies.rectangle(0, 300, 100, 600, { isStatic: true, label: "wall" }),
    ];

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        render: { visible: false },
        stiffness: 0,
      },
    });

    Events.on(render, "afterRender", () => {
      //   console.log(this.isDragging, this.selectedStone, this.startPosition);
      if (this.isDragging && this.selectedStone && this.startPosition) {
        const context = render.context;
        context.beginPath();
        context.moveTo(
          this.selectedStone.position.x,
          this.selectedStone.position.y
        );
        context.lineTo(mouse.position.x, mouse.position.y);
        context.strokeStyle = "#ff0000"; // 빨간색 선
        context.lineWidth = 2;
        context.stroke();
        // emit
        if (!timer) {
          timer = setTimeout(() => {
            if (this.isDragging && this.selectedStone && this.startPosition)
              dragCallback(this.selectedStone.position, mouse.position);
            timer = null;
          }, 100);
        }
      } else {
        if (this.indicator) {
          const context = render.context;
          context.beginPath();
          context.moveTo(
            this.indicator.startPosition.x,
            this.indicator.startPosition.y
          );
          context.lineTo(
            this.indicator.endPosition.x,
            this.indicator.endPosition.y
          );
          context.strokeStyle = "#ff0000"; // 빨간색 선
          context.lineWidth = 2;
          context.stroke();
        }
      }
    });

    Events.on(mouseConstraint, "mousedown", (event) => {
      const mousePosition = event.mouse.position;
      this.myStones.forEach((stone) => {
        if (Bounds.contains(stone.bounds, mousePosition)) {
          this.selectedStone = stone;
          this.startPosition = { x: mousePosition.x, y: mousePosition.y };
          this.isDragging = true;
        }
      });
    });
    Events.on(mouseConstraint, "mouseup", (event) => {
      if (this.selectedStone && this.startPosition) {
        const endPosition = event.mouse.position;

        // emit
        this.actionCallback(
          this.selectedStone.label,
          this.startPosition,
          endPosition
        );
      }
      this.selectedStone = null;
      this.startPosition = null;
      this.isDragging = false;
    });

    // 충돌 이벤트 처리
    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((pair) => {
        if (
          (pair.bodyA.label.includes("stone") && pair.bodyB.label === "wall") ||
          (pair.bodyA.label === "wall" && pair.bodyB.label.includes("stone"))
        ) {
          // 바둑돌과 벽이 충돌한 경우
          const stone = pair.bodyA.label.includes("stone")
            ? pair.bodyA
            : pair.bodyB;
          // 바둑돌 제거
          this.stones = this.stones.filter((i) => i.label !== stone.label);
          World.remove(engine.world, stone);
        }
      });
    });

    World.add(engine.world, [...this.stones, ...walls, mouseConstraint]);

    Runner.run(engine);
    Render.run(render);
  }

  hit(
    label: string,
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number }
  ) {
    const stone = this.stones.find((stone) => stone.label === label);
    if (!stone) return;
    const force = Vector.sub(startPosition, endPosition);
    Body.applyForce(stone, stone.position, {
      x: force.x * 0.001, // 힘의 크기를 조절
      y: force.y * 0.001,
    });
    console.log(this.stones);
  }
  setIndicator(
    startPosition: { x: number; y: number },
    endPosition: { x: number; y: number }
  ) {
    this.indicator = {
      startPosition,
      endPosition,
    };
  }
  clearIndicator() {
    this.indicator = null;
  }
  whoIsWinner() {
    if (this.stones.filter((i) => i.label.includes("stoneb")).length === 0) {
      return "white";
    }
    if (this.stones.filter((i) => i.label.includes("stoneb")).length === 0) {
      return "black";
    }
    return null;
  }
}

export default SceneManager;
