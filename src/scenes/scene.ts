import { Camera, Renderer, Scene } from "three";
import { GameState } from "../game";

export abstract class GameScene {
  isInitialized = false;
  protected scene: Scene;

  constructor(
    protected readonly renderer: Renderer,
    protected readonly camera: Camera
  ) {}

  public init(): void {
    this.scene = this.setup();
    this.isInitialized = true;
  }

  public render(): void {
    if (!this.isInitialized) throw new Error("Scene not initialized");
    this.renderer.render(this.scene, this.camera);
  }

  public abstract update(delta: number, gameState: GameState): GameState;

  protected abstract setup(): Scene;
}
