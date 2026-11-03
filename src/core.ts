// Plugin logic with injected dependencies so it runs under vitest (no Capacitor runtime).
import type { WatchtowerClient, WatchtowerConfig } from "@watchtowerobservability/browser";

export interface InitOptions {
  /** Publishable ingest key. Sent as `Authorization: Bearer`, never logged. */
  publishableKey: string;
  /** Edge base URL. */
  endpoint: string;
  service: string;
  release?: string;
  environment?: string;
  /** Redaction hook of the browser SDK. */
  beforeSend?: WatchtowerConfig["beforeSend"];
  /** Masked replay: DOM recording on the web, screenshot replay inside the native shell. */
  replay?: WatchtowerConfig["replay"];
  /** Set false to skip the native SDK inside the iOS/Android shell (default true). */
  native?: boolean;
}

/** What the native bridge receives (registerPlugin('Watchtower')). */
export interface NativeOptions {
  key: string;
  endpoint: string;
  service: string;
  release?: string;
  environment?: string;
  replay: boolean;
}

export interface NativePlugin {
  init(o: NativeOptions): Promise<void>;
  flush(): Promise<void>;
}

export interface Deps {
  browser: { init(c: WatchtowerConfig): WatchtowerClient };
  plugin: NativePlugin;
  /** Whether the webview runs inside the iOS/Android shell. */
  isNative: boolean;
}

const REQUIRED = ["publishableKey", "endpoint", "service"] as const;

export function createWatchtower({ browser, plugin, isNative }: Deps) {
  let web: WatchtowerClient | undefined;
  return {
    /** Starts the browser SDK in the webview and, on devices, the native SDK (crashes, ANR/hangs, replay). */
    async init(o: InitOptions): Promise<WatchtowerClient> {
      for (const k of REQUIRED) if (!o?.[k]) throw new Error(`${k} is required`);
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
    captureError(err: unknown, ctx?: Record<string, string | number | boolean>): void {
      web?.captureError(err, ctx);
    },
    async flush(): Promise<void> {
      if (isNative) await plugin.flush();
      if (web) await web.replay.flush();
    },
  };
}
