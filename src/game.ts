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

enum GamePhase {
  UNSUPPORTED,
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

  public async start() {
    try {
      await this.setup();
      this.activeGameScene = new MainMenuScene();
      this.renderer.setAnimationLoop(() => this.update());
    } catch (error) {
      console.error(error);
      this.stop();
    }
  }

  public stop() {
    this.renderer.setAnimationLoop(null);
  }

  /**
   * The main game loop
   */
  private update() {
    const delta = this.clock.getDelta();
    this.gameState = this.activeGameScene.update(delta, this.gameState);
    this.renderer.render(this.activeGameScene.getScene(), this.camera);
  }

  private async setup() {
    const isSessionSupported = await this.xr.isSessionSupported("immersive-vr");
    if (!isSessionSupported)
      throw new Error("WebXR is not supported on this device");
    this.session = await this.xr.requestSession("immersive-vr", {
      optionalFeatures: ["local-floor"],
    });

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.useLegacyLights = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.xr.enabled = true;
    await this.renderer.xr.setSession(this.session);

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

    /*
    // controllers

    controller1 = renderer.xr.getController(0);
    this.activeScene.add(controller1);

    controller2 = renderer.xr.getController(1);
    this.activeScene.add(controller2);

    const controllerModelFactory = new XRControllerModelFactory();
    const handModelFactory = new XRHandModelFactory();

    // Hand 1
    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(
      controllerModelFactory.createControllerModel(controllerGrip1)
    );
    this.activeScene.add(controllerGrip1);

    hand1 = renderer.xr.getHand(0);
    hand1.add(handModelFactory.createHandModel(hand1));

    this.activeScene.add(hand1);

    // Hand 2
    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(
      controllerModelFactory.createControllerModel(controllerGrip2)
    );
    this.activeScene.add(controllerGrip2);

    hand2 = renderer.xr.getHand(1);
    hand2.add(handModelFactory.createHandModel(hand2));
    this.activeScene.add(hand2);

    //

    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(0, 0, -1),
    ]);

    const line = new Line(geometry);
    line.name = "line";
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());
    */

    window.addEventListener("resize", () => this.onWindowResize());
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
