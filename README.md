# @watchtowerobservability/capacitor

One `init` for a Capacitor app: the [browser SDK](https://github.com/watchtowerobservability/watchtower-browser) runs
in the webview (JS errors, vitals, sessions), and inside the iOS/Android shell the native
[iOS](https://github.com/watchtowerobservability/watchtower-ios) and
[Android](https://github.com/watchtowerobservability/watchtower-android) SDKs add native crashes, ANR/hangs and screenshot replay.
Plain JavaScript with hand-written `.d.ts`.

## Install

```sh
echo '@watchtowerobservability:registry=https://npm.pkg.github.com' >> .npmrc
npm install @watchtowerobservability/capacitor @watchtowerobservability/browser
npx cap sync
```

iOS pulls the native SDK through Swift Package Manager. Android needs the `:watchtower-android` module from
`watchtower-android` (no Maven registry yet): in `android/settings.gradle` add
`include ':watchtower-android'` and point `project(':watchtower-android').projectDir` at the downloaded sources.

## Quick start

```js
import { init } from '@watchtowerobservability/capacitor';

await init({
  publishableKey: 'PUBLISHABLE_KEY',
  endpoint: 'https://edge.example.com',
  service: 'my-app',
  release: '1.2.3',
  environment: 'production',
});
```

## Integrations

| Layer | Provides |
|---|---|
| Browser SDK (always) | JS errors, web vitals, sessions, journeys, `beforeSend` redaction |
| iOS SDK (device) | crashes, hangs, app start, frame metrics, masked screenshot replay |
| Android SDK (device) | crashes, ANR, app start, frame metrics, masked screenshot replay |

On a device the DOM replay recorder is turned off and `replay` switches on the native screenshot replay instead.

## Configuration

| Option | Meaning |
|---|---|
| `publishableKey` | required; sent as `Authorization: Bearer`, never logged |
| `endpoint` | required; edge base URL (the app has no env vars; read it from your build config) |
| `service`, `environment`, `release` | resource attributes (the `WT_SERVICE`, `WT_ENVIRONMENT`, `WT_RELEASE` equivalents) |
| `beforeSend` | redaction hook, return `null` to drop |
| `replay` | masked replay options |
| `native` | `false` skips the native SDKs |

## Provenance

`gh attestation verify <file> --repo watchtowerobservability/watchtower-capacitor`

## License

Apache-2.0
