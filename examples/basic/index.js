// Minimal app entry (bundle with Vite/webpack, then `npx cap sync && npx cap run ios|android`).
import { init, captureError } from '@watchtowerobservability/capacitor';

await init({
  publishableKey: import.meta.env.VITE_WT_PUBLISHABLE_KEY,
  endpoint: import.meta.env.VITE_WT_ENDPOINT,
  service: 'capacitor-example',
});
document.body.innerHTML = '<button id="b">Throw</button>';
document.getElementById('b').onclick = () => captureError(new Error('capacitor test error'));
