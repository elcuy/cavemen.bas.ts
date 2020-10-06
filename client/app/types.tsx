interface Vector {
  x: number;
  y: number;
}

export type Velocity = Vector;
export type Position = Vector;

export type Orientation = "left" | "right";
export type BoneActions = "spin";
export type PlayerActions = "idle" | "attack" | "death";

export interface Sprite<T extends string> {
  id: string;
  class: string;
  animations: AnimationMap<T>;
}

type AnimationMap<T extends string> = {
  [A in T]: Animation
}

export interface Animation {
  spriteRow: number;
  numFrames: number;
  fps: number;
  loop: boolean;
}
