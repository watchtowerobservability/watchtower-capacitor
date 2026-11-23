# Changelog

## 0.1.2 (2026-11-23)

- Fix: the type declarations now resolve under `moduleResolution: "node16"` / `"nodenext"` (relative imports carry `.js`; before, every import from the package was TS2834/TS2835). The declaration build runs with NodeNext so this cannot regress. Needs `@watchtowerobservability/browser` 0.6.1 or later for the re-exported types.

## 0.1.0

- Capacitor plugin: browser SDK in the webview, native iOS and Android SDKs on devices.

## 0.1.1

- Sync with the monorepo: Hermetica write-up follow-ups and standalone builds in the public mirror.

- Rewritten in TypeScript (ESM build with declarations; tests on vitest).
