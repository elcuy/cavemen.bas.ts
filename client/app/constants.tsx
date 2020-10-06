import { BoneActions, PlayerActions, Sprite } from "./types"

export const player1: Sprite<PlayerActions> = {
  id: "player1",
  class: "player-1",
  animations: {
    idle:   { spriteRow: 1, numFrames: 7, fps: 8, loop: true },
    attack: { spriteRow: 2, numFrames: 4, fps: 8, loop: false },
    death:  { spriteRow: 3, numFrames: 4, fps: 8, loop: false }
  }
}

export const player2: Sprite<PlayerActions> = {
  id: "player2",
  class: "player-2",
  animations: {
    idle:   { spriteRow: 1, numFrames: 5, fps: 8, loop: true },
    attack: { spriteRow: 2, numFrames: 4, fps: 8, loop: false },
    death:  { spriteRow: 3, numFrames: 4, fps: 8, loop: false }
  }
}

export const bone: Sprite<BoneActions> = {
  id: "bone",
  class: "bone",
  animations: {
    spin: { spriteRow: 1, numFrames: 9, fps: 18, loop: true }
  }
}
