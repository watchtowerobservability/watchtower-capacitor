// Plugin logic with injected dependencies so it runs under plain `node --test` (no Capacitor runtime).
const REQUIRED = ['publishableKey', 'endpoint', 'service'];

/**
 * `browser` is the @watchtowerobservability/browser module, `plugin` the native bridge,
 * `isNative` whether the webview runs inside the iOS/Android shell.
 */
export function createWatchtower({ browser, plugin, isNative }) {
  let web;
  return {
    /** Starts the browser SDK in the webview and, on devices, the native SDK (crashes, ANR/hangs, replay). */
    async init(opts) {
      const o = opts || {};
      for (const k of REQUIRED) if (!o[k]) throw new Error(`${k} is required`);
      const native = isNative && o.native !== false;
      web = browser.init({
        publishableKey: o.publishableKey,
        endpoint: o.endpoint,
        service: o.service,
        release: o.release,
        environment: o.environment,
        beforeSend: o.beforeSend,
        // on a device the native SDK records the screen; the DOM recorder would duplicate it
        replay: native ? undefined : o.replay,
      });
      if (native) {
        await plugin.init({
          key: o.publishableKey,
          endpoint: o.endpoint,
          service: o.service,
          release: o.release,
          environment: o.environment,
          replay: !!o.replay,
        });
      }
      return web;
    },
    captureError(err, ctx) {
      if (web) web.captureError(err, ctx);
    },
    async flush() {
      if (isNative) await plugin.flush();
      if (web) await web.replay.flush();
    },
  };
}
