import { Scene } from "three";
import { GameState } from "../game";

export abstract class GameScene {
  public abstract getScene(): Scene;
  public abstract update(delta: number, gameState: GameState): GameState;
}
