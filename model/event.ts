type Member = {
  id: string;
  name: string;
};

// Client To Server Events
export const enum C2SEventType {
  JOIN = "JOIN",
  CHAT = "CHAT",
  START = "START",
  ACTION = "ACTION",
  SYNC = "SYNC",
}

export type JoinPayload = {
  roomId: string;
  member: Member;
};
export type ChatPayload = {
  type: "USR";
  member: Member;
  text: string;
};
export type StartPayload = {
  // nothing
};
export type ActionPayload =
  | {
      type: "MOVE";
      label: string;
      startPosition: { x: number; y: number };
      endPosition: { x: number; y: number };
    }
  | {
      type: "DRAG";
      startPosition: { x: number; y: number };
      endPosition: { x: number; y: number };
    };
export type SyncPayload = {
  result?: "PLAYER1" | "PLAYER2";
  data: any;
};

export type C2SEvent =
  | {
      roomId: string;
      type: C2SEventType.JOIN;
      payload: JoinPayload;
    }
  | {
      roomId: string;
      type: C2SEventType.CHAT;
      payload: ChatPayload;
    }
  | {
      roomId: string;
      type: C2SEventType.START;
      payload: StartPayload;
    }
  | {
      roomId: string;
      type: C2SEventType.ACTION;
      payload: ActionPayload;
    }
  | {
      roomId: string;
      type: C2SEventType.SYNC;
      payload: SyncPayload;
    };

// Server To Client Events
export const enum S2CEventType {
  CHATTING_UPDATED = "CHATTING_UPDATED",
  MEMBER_UPDATED = "MEMBER_UPDATED",
  STATUS_UPDATED = "STATUS_UPDATED",
  SCENE_UPDATED = "SCENE_UPDATED",
}

export const enum GameStatus {
  PENDING = "PENDING",
  PLAYER1TURN = "PLAYER1TURN",
  PLAYER2TURN = "PLAYER2TURN",
}

export type ChattingUpdatedPayload =
  | {
      type: "SYS";
      text: string;
    }
  | {
      type: "USR";
      member: Member;
      text: string;
    };
export type MemberUpdatedPayload = {
  members: Member[];
};
export type StatusUpdatedPayload = {
  status: GameStatus;
  winner?: "PLAYER1" | "PLAYER2";
};
export type SceneUpdatedPayload = ActionPayload;

export type S2CEvent =
  | {
      roomId: string;
      type: S2CEventType.CHATTING_UPDATED;
      payload: ChattingUpdatedPayload;
    }
  | {
      roomId: string;
      type: S2CEventType.MEMBER_UPDATED;
      payload: MemberUpdatedPayload;
    }
  | {
      roomId: string;
      type: S2CEventType.STATUS_UPDATED;
      payload: StatusUpdatedPayload;
    }
  | {
      roomId: string;
      type: S2CEventType.SCENE_UPDATED;
      payload: SceneUpdatedPayload;
    };
