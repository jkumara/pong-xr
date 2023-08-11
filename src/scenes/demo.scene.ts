import { Color, Mesh, MeshBasicMaterial, PlaneGeometry, Scene } from "three";
import { GameState } from "../game";
import { GameScene } from "./scene";

enum Direction {
  UP = 1,
  DOWN = -1,
}

export class DemoScene extends GameScene {
  wallSize = 16;
  lineWidth = 8;
  paddleVelocity = 20.0;
  ballSize = 16;
  ballInitialVelocity = 150.0;
  ballVelocityIncrement = 25.0;
  fontSize = 64;
  arenaWidth = 80;
  arenaHeight = 60;
  paddleWidth = 2;
  paddleHeight = 10;

  paddle1: Mesh;
  paddle1Direction: Direction = Direction.UP;
  paddle2: Mesh;
  paddle2Direction: Direction = Direction.DOWN;
  ball: Mesh;

  public update(delta: number, gameState: GameState): GameState {
    this.paddle1Direction = this.getPaddleDirection(
      this.paddle1,
      this.paddle1Direction
    );
    this.paddle2Direction = this.getPaddleDirection(
      this.paddle2,
      this.paddle2Direction
    );
    this.movePaddle(this.paddle1, delta, this.paddle1Direction);
    this.movePaddle(this.paddle2, delta, this.paddle2Direction);
    return gameState;
  }

  protected setup(): Scene {
    const pongMaterial = new MeshBasicMaterial({
      color: Color.NAMES.white,
    });
    const paddleGeometry = new PlaneGeometry(
      this.paddleWidth,
      this.paddleHeight
    );

    const scene = new Scene();
    scene.background = new Color(Color.NAMES.black);

    const paddle1 = new Mesh(paddleGeometry, pongMaterial);
    paddle1.position.set(
      (this.arenaWidth / 2) * -1 - this.paddleWidth / 2,
      0,
      0
    );
    scene.add(paddle1);
    this.paddle1 = paddle1;

    const paddle2 = new Mesh(paddleGeometry, pongMaterial);
    paddle2.position.set(this.arenaWidth / 2 - this.paddleWidth / 2, 0, 0);
    scene.add(paddle2);
    this.paddle2 = paddle2;

    return scene;
  }

  private movePaddle(paddle: Mesh, delta: number, direction: Direction) {
    paddle.position.y += this.paddleVelocity * delta * direction;
    if (paddle.position.y > this.arenaHeight / 2 - this.paddleHeight / 2) {
      paddle.position.y = this.arenaHeight / 2 - this.paddleHeight / 2;
    } else if (
      paddle.position.y <
      (this.arenaHeight / 2 - this.paddleHeight / 2) * -1
    ) {
      paddle.position.y = (this.arenaHeight / 2 - this.paddleHeight / 2) * -1;
    } else {
      return direction;
    }
  }

  private getPaddleDirection(paddle: Mesh, direction: Direction) {
    if (
      direction === Direction.UP &&
      paddle.position.y >= this.arenaHeight / 2 - this.paddleHeight / 2
    ) {
      return Direction.DOWN;
    } else if (
      direction === Direction.DOWN &&
      paddle.position.y <= (this.arenaHeight / 2 - this.paddleHeight / 2) * -1
    ) {
      return Direction.UP;
    } else {
      return direction;
    }
  }
}
