import { Capacitor, registerPlugin } from "@capacitor/core";
import * as browser from "@watchtowerobservability/browser";
import { createWatchtower, type NativePlugin } from "./core";

export type { InitOptions } from "./core";

const wt = createWatchtower({ browser, plugin: registerPlugin<NativePlugin>("Watchtower"), isNative: Capacitor.isNativePlatform() });

export const init = wt.init;
export const captureError = wt.captureError;
export const flush = wt.flush;
