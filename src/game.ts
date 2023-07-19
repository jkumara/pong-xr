import {
  BufferGeometry,
  Color,
  DirectionalLight,
  HemisphereLight,
  Line,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderer,
  Clock,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { GameScene } from "./scenes/scene";
import { MainMenuScene } from "./scenes/main-menu.scene";
import { WebXrPrompt } from "./webxr-prompt";

enum GamePhase {
  UNSUPPORTED,
  PROMPT_VR,
  LOADING,
  PLAYING,
  PAUSED,
  GAME_OVER,
}

export interface GameState {
  phase: GamePhase;
  playerScore: number;
  enemyScore: number;
  maxScore: number;
}

export class Game {
  private readonly clock: Clock = new Clock();
  private gameState: GameState = {
    phase: GamePhase.LOADING,
    playerScore: 0,
    enemyScore: 0,
    maxScore: 5,
  };
  private session: XRSession;
  private container: HTMLDivElement;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private activeGameScene: GameScene;

  constructor(private readonly xr: XRSystem) {}

  /**
   * Initialize the game and start the main loop. Should be called only when the user
   * has requested to enter VR mode.
   */
  public async start() {
    try {
      await this.initialize();
      this.activeGameScene = new MainMenuScene();
      this.renderer.setAnimationLoop(() => this.update());
    } catch (error) {
      console.error(error);
      this.stop();
    }
  }

  public stop() {
    this?.session?.end();
    this.renderer.setAnimationLoop(null);
  }

  /**
   * Initialize the camera and the WebGL renderer
   */
  private async initialize() {
    const isSessionSupported = await this.xr.isSessionSupported("immersive-vr");
    if (!isSessionSupported)
      throw new Error("WebXR is not supported on this device");

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.useLegacyLights = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.xr.enabled = true;

    this.container = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      10
    );
    this.camera.position.set(0, 1.6, 3);
    const controls = new OrbitControls(this.camera, this.container);
    controls.target.set(0, 1.6, 0);
    controls.update();

    const prompt = new WebXrPrompt();
    prompt.getButton().addEventListener("click", () => {
      this.initializeXR();
      prompt.setLoaded();
    });

    window.addEventListener("resize", () => this.onWindowResize());
  }

  /**
   * Initializes and attaches the WebXR session to the renderer. This must be done
   * after user interaction (e.g. button click) to prevent the browser from blocking
   */
  async initializeXR() {
    this.session = await this.xr.requestSession("immersive-vr", {
      optionalFeatures: ["local-floor"],
    });
    await this.renderer.xr.setSession(this.session);
  }

  /**
   * The main game loop
   */
  private update() {
    const delta = this.clock.getDelta();
    this.gameState = this.activeGameScene.update(delta, this.gameState);
    this.renderer.render(this.activeGameScene.getScene(), this.camera);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
