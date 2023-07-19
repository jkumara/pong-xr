import { Game } from "./game";
import WebXRPolyfill from "webxr-polyfill";

new Game(new WebXRPolyfill()).start();
