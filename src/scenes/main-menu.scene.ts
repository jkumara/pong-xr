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
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
import { GameScene } from "./scene";
import { GameState } from "../game";

export class MainMenuScene extends GameScene {
  private scene = this.setup();

  public getScene(): Scene {
    return this.scene;
  }

  public update(delta: number, gameState: GameState): GameState {
    return gameState;
  }

  private setup(): Scene {
    const scene = new Scene();
    scene.background = new Color(0x444444);

    const floorGeometry = new PlaneGeometry(4, 4);
    const floorMaterial = new MeshStandardMaterial({ color: 0xff0099 });
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    scene.add(new HemisphereLight(0xbcbcbc, 0xa5a5a5, 3));

    const light = new DirectionalLight(0xffffff, 3);
    light.position.set(0, 6, 0);
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = -2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = -2;
    light.shadow.mapSize.set(4096, 4096);
    scene.add(light);

    return scene;
  }
}
