import type { WatchtowerClient, WatchtowerConfig } from '@watchtowerobservability/browser';

export interface InitOptions {
  /** Publishable ingest key. Sent as `Authorization: Bearer`, never logged. */
  publishableKey: string;
  /** Edge base URL. */
  endpoint: string;
  service: string;
  release?: string;
  environment?: string;
  /** Redaction hook of the browser SDK. */
  beforeSend?: WatchtowerConfig['beforeSend'];
  /** Masked replay: DOM recording on the web, screenshot replay inside the native shell. */
  replay?: WatchtowerConfig['replay'];
  /** Set false to skip the native SDK inside the iOS/Android shell (default true). */
  native?: boolean;
}
export function init(opts: InitOptions): Promise<WatchtowerClient>;
export function captureError(err: unknown, ctx?: Record<string, string | number | boolean>): void;
export function flush(): Promise<void>;
