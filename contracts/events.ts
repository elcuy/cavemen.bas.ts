export type SocketEvent = "player_join" | "throw" | "hit";

interface Position {
  x: number;
  y: number;
}

export interface Throw {
  origin: Position;
  angle: number;
  velocity: number;
}

export interface Hit {
  player: string;
}
