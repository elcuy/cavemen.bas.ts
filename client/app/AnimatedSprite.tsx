import { Orientation, Position, Sprite } from "./types";
import React, { useEffect, useState } from "react"

import { useFramerate } from "./hooks/useFramerate";

interface AnimatedSpriteProps<T extends string> {
  position: Position;
  orientation: Orientation;
  sprite: Sprite<T>;
  action: T;
  visible: boolean;
}

function AnimatedSprite<T extends string>({ sprite, position, orientation, action, visible }: AnimatedSpriteProps<T>): JSX.Element {
  const [currentFrame, setCurrentFrame] = useState(0);

  const { triggerRender } = useFramerate(sprite.animations[action].fps);

  useEffect(() => {
    setCurrentFrame(getNextFrame());
  }, [triggerRender]);

  const getNextFrame = () => {
    if (currentFrame + 1 > sprite.animations[action].numFrames) {
      return sprite.animations[action].loop ? 1 : currentFrame;
    }
    return currentFrame + 1;
  };

  const orientationStyle = orientation === "right" ? {} : { transform: "scaleX(-1)" };

  const display = visible ? "block" : "none";

  return <div
      className={`${sprite.class} row${sprite.animations[action].spriteRow} col${currentFrame}`}
      style={{ left: position.x, bottom: position.y, display, ...orientationStyle }}
    >
    </div>;
};

export default AnimatedSprite;
