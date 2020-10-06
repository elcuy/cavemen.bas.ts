import { BoneActions, PlayerActions, Position, Sprite, Velocity } from "./types";
import React, { useEffect, useState } from "react"
import { bone, player1, player2 } from "./constants";

import AnimatedSprite from "./AnimatedSprite";
import { Throw } from "@contracts/events";
import { socketThrow } from "./sockets/events";
import { useFramerate } from "./hooks/useFramerate";

const BASE_GROUND_LEVEL: number = 35;
const COLLISION_OFFSET: number = 50;
const SCENE_WIDTH: number = 1600;
const SCENE_HEIGHT: number = 671;

type StateSetter = (value: React.SetStateAction<number>) => void;

const Scene = (): JSX.Element => {
  const [bonePosition, setBonePosition] = useState<Position>({ x: 150, y: 150 });

  const [player1Position] = useState<Position>({ x: 0, y: BASE_GROUND_LEVEL });
  const [player2Position] = useState<Position>({ x: 1500, y: BASE_GROUND_LEVEL });

  const [player1Angle, setPlayer1Angle] = useState(30);
  const [player2Angle, setPlayer2Angle] = useState(30);
  const [player1Velocity, setPlayer1Velocity] = useState(162);
  const [player2Velocity, setPlayer2Velocity] = useState(162);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);

  const [throwing, setThrowing] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [loggedPlayer, setLoggedPlayer] = useState<Sprite<PlayerActions>>();
  const [velocityVector, setVelocityVector] = useState<Velocity>({ x: 0, y: 0 })

  const { triggerRender } = useFramerate(20);

  useEffect(() => {
    const getPlayerFromUrl = () => {
      const url = window.location.href;
      const playerId = url.substring(url.lastIndexOf('/') + 1);
      return playerId === "player2" ? player2 : player1;
    }

    setLoggedPlayer(getPlayerFromUrl());
  }, []);

  useEffect(() => {
    const handleThrow = ({ origin, angle, velocity }: Throw) => {
      const radians = angle * Math.PI / 180;
      const direction = currentPlayer === player1 ? 1 : -1;
      const vx = ((velocity * Math.cos(radians)) / 4) * direction;
      const vy = ((velocity * Math.sin(radians)) / 4);
      const x = origin.x + COLLISION_OFFSET * direction;
      const y = origin.y + COLLISION_OFFSET;
      setBonePosition({ x, y });
      setVelocityVector({ x: vx, y: vy });
      setThrowing(true);
    };

    socketThrow.on(handleThrow);

    return () => {
      socketThrow.off(handleThrow);
    }
  }, [currentPlayer]);

  const inputChange = (handler: StateSetter) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handler(parseInt(event.target.value));
  };

  useEffect(() => {
    const { x: vx, y: vy } = velocityVector;
    const { x, y } = bonePosition;

    if (throwing && collided()) {
      switchPlayer();
      setThrowing(false);
      setVelocityVector({ x: 0, y: 0 });
    }

    if (throwing) {
      setVelocityVector({ x: vx, y: vy - 1 });
      setBonePosition({ x: x + vx, y: y + vy });
    }
  }, [triggerRender]);

  const checkCollision = ({x: x1, y: y1}: Position, {x: x2, y: y2}: Position): boolean => {
    const deltaX = Math.abs(x1 - x2);
    const deltaY = Math.abs(y1 - y2);
    return deltaX <= COLLISION_OFFSET && deltaY <= COLLISION_OFFSET;
  }

  const switchPlayer = () => setCurrentPlayer(currentPlayer === player1 ? player2 : player1);

  const collided = (): boolean => {
    if (currentPlayer === player1 && checkCollision(bonePosition, player2Position)) {
      setPlayer1Score(player1Score + 1);
      return true;
    }

    if (currentPlayer === player2 && checkCollision(bonePosition, player1Position)) {
      setPlayer2Score(player2Score + 1);
      return true;
    }

    if (outOfBounds(bonePosition)) {
      return true;
    }

    return false;
  };

  const outOfBounds = ({x, y}: Position): boolean => {
    return y < BASE_GROUND_LEVEL || x < 0 || x > SCENE_WIDTH;
  }

  const throwBone = (origin: Position, angle: number, velocity: number) => {
    return () => socketThrow.emit({ origin, angle, velocity});
  };

  const controlsVisible = (player: Sprite<PlayerActions>) => {
    if (throwing) return false;
    if (loggedPlayer === player && currentPlayer === player) return true;
    return false;
  }

  const renderControls = (
    player: Sprite<PlayerActions>,
    angle: number,
    angleSetter: StateSetter,
    velocity: number,
    velocitySetter: StateSetter,
    position: Position
  ): JSX.Element | undefined => {
    if (!controlsVisible(player)) return;

    return (
      <div>
        <input type="number" value={angle} onChange={inputChange(angleSetter)} />
        <input type="number" value={velocity} onChange={inputChange(velocitySetter)} />
        <button onClick={throwBone(position, angle, velocity)}>Throw</button>
      </div>
    );
  }

  return (
    <div className="scene" style={{ width: SCENE_WIDTH, height: SCENE_HEIGHT }}>
      <AnimatedSprite<PlayerActions>
        sprite={player1}
        position={player1Position}
        orientation="right"
        action="idle"
        visible
      />

      <AnimatedSprite<PlayerActions>
        sprite={player2}
        position={player2Position}
        orientation="left"
        action="idle"
        visible
      />

      <AnimatedSprite<BoneActions>
        sprite={bone}
        position={bonePosition}
        orientation="right"
        action="spin"
        visible={throwing}
      />

      <div>Player 1: {player1Score} - Player 2: {player2Score}</div>
      { renderControls(player1, player1Angle, setPlayer1Angle, player1Velocity, setPlayer1Velocity, player1Position) }
      { renderControls(player2, player2Angle, setPlayer2Angle, player2Velocity, setPlayer2Velocity, player2Position) }
    </div>
  );
};

export default Scene;
