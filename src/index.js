import { Capacitor, registerPlugin } from '@capacitor/core';
import * as browser from '@watchtowerobservability/browser';
import { createWatchtower } from './core.js';

const plugin = registerPlugin('Watchtower');
const wt = createWatchtower({ browser, plugin, isNative: Capacitor.isNativePlatform() });

export const init = wt.init;
export const captureError = wt.captureError;
export const flush = wt.flush;
