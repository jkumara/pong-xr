import { Clock, PerspectiveCamera, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DemoScene } from "./scenes/demo.scene";
import { MainMenuScene } from "./scenes/main-menu.scene";
import { GameScene } from "./scenes/scene";
import { WebXrPrompt } from "./webxr-prompt";

export enum GameState {
  UNSUPPORTED,
  PROMPT_VR,
  PLAYING,
  PAUSED,
  GAME_OVER,
}

export class Game {
  private readonly clock: Clock = new Clock();
  private gameState: GameState = GameState.PROMPT_VR;
  // Used to detect when a scene should be changed
  private previousGameState: GameState;
  private activeScene: GameScene;
  private session: XRSession;
  private container: HTMLDivElement;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;

  constructor(private readonly xr: XRSystem) {}

  /**
   * Initialize the game and start the main loop. Should be called only when the user
   * has requested to enter VR mode.
   */
  public async start() {
    try {
      await this.initialize();
      this.activeScene = new MainMenuScene(this.renderer, this.camera);
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
    if (!isSessionSupported) {
      this.gameState = GameState.UNSUPPORTED;
      throw new Error("WebXR is not supported on this device");
    }

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
      500
    );
    this.setup2dCamera();

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
  private async initializeXR() {
    this.session = await this.xr.requestSession("immersive-vr", {
      optionalFeatures: ["local-floor"],
    });
    await this.renderer.xr.setSession(this.session);
    this.setupXrCamera();
    this.gameState = GameState.PLAYING;
  }

  /**
   * The main game loop
   */
  private update() {
    if (this.previousGameState !== this.gameState) {
      this.previousGameState = this.gameState;
      this.changeActiveScene();
    }

    const delta = this.clock.getDelta();
    this.gameState = this.activeScene.update(delta, this.gameState);
    this.activeScene.render();
  }

  private changeActiveScene() {
    switch (this.gameState) {
      case GameState.PROMPT_VR:
        this.activeScene = new DemoScene(this.renderer, this.camera);
        break;
      default:
        this.activeScene = new MainMenuScene(this.renderer, this.camera);
        break;
    }
    this.activeScene.init();
  }

  private setup2dCamera() {
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(0, 0, 0);
  }

  private setupXrCamera() {
    const controls = new OrbitControls(this.camera, this.container);
    controls.target.set(0, 1.6, 0);
    controls.update();
    this.camera.position.set(0, 1.6, 3);
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
