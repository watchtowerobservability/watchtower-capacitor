import { describe, expect, it } from "vitest";
import type { WatchtowerClient, WatchtowerConfig } from "@watchtowerobservability/browser";
import { createWatchtower, type InitOptions } from "./core";

function fakes() {
  const calls: [string, unknown?][] = [];
  const client = {
    captureError: (e: unknown) => calls.push(["capture", e]),
    replay: { flush: async () => void calls.push(["replayFlush"]) },
  } as unknown as WatchtowerClient;
  return {
    calls,
    browser: { init: (c: WatchtowerConfig) => { calls.push(["browser", c]); return client; } },
    plugin: { init: async (c: unknown) => void calls.push(["native", c]), flush: async () => void calls.push(["nativeFlush"]) },
  };
}
const opts: InitOptions = { publishableKey: "pk", endpoint: "http://e", service: "s", replay: { enabled: true } as WatchtowerConfig["replay"] };

describe("capacitor", () => {
  it("native shell: browser SDK without DOM replay, native SDK with replay flag", async () => {
    const f = fakes();
    await createWatchtower({ ...f, isNative: true }).init(opts);
    expect((f.calls[0]![1] as WatchtowerConfig).replay).toBeUndefined();
    expect(f.calls[1]![1]).toEqual({ key: "pk", endpoint: "http://e", service: "s", release: undefined, environment: undefined, replay: true });
  });

  it("web: browser SDK only, replay kept", async () => {
    const f = fakes();
    await createWatchtower({ ...f, isNative: false }).init(opts);
    expect(f.calls.map((c) => c[0])).toEqual(["browser"]);
    expect((f.calls[0]![1] as WatchtowerConfig).replay).toEqual({ enabled: true });
  });

  it("native:false skips the native SDK", async () => {
    const f = fakes();
    await createWatchtower({ ...f, isNative: true }).init({ ...opts, native: false });
    expect(f.calls.map((c) => c[0])).toEqual(["browser"]);
  });

  it("required options are checked", async () => {
    const f = fakes();
    await expect(createWatchtower({ ...f, isNative: false }).init({ endpoint: "x", service: "s" } as InitOptions)).rejects.toThrow(/publishableKey/);
  });

  it("captureError and flush", async () => {
    const f = fakes();
    const wt = createWatchtower({ ...f, isNative: true });
    wt.captureError(new Error("before init")); // ignored, no throw
    await wt.init(opts);
    wt.captureError("e");
    await wt.flush();
    expect(f.calls.slice(2).map((c) => c[0])).toEqual(["capture", "nativeFlush", "replayFlush"]);
  });
});
