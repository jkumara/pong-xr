import { Game } from "./game";
import WebXRPolyfill from "webxr-polyfill";

new Game(navigator.xr || new WebXRPolyfill()).start();
