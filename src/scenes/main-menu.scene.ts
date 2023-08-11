import {
  Color,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  Scene,
} from "three";
import { GameState } from "../game";
import { GameScene } from "./scene";

export class MainMenuScene extends GameScene {
  public update(delta: number, gameState: GameState): GameState {
    return gameState;
  }

  protected setup(): Scene {
    // this.camera.position.set(0, 1.6, 3);

    const scene = new Scene();
    scene.background = new Color(0x444444);

    const floorGeometry = new PlaneGeometry(4, 4);
    const floorMaterial = new MeshStandardMaterial({ color: 0xaa00ff });
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
