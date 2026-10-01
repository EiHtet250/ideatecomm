import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  /**
   * Optional development-only relay for the help / feedback / chatbot n8n.
   *
   * That n8n only accepts browser requests from http://localhost:5173, so the site cannot
   * reach it when opened from another address (e.g. a phone on the same Wi-Fi). When
   * N8N_PROXY_TARGET is set in .env.local, the dev server forwards /n8n-proxy/... to it,
   * and the browser only ever talks to the dev server.
   *
   * Use it by setting, in .env.local:
   *   N8N_PROXY_TARGET=https://<the n8n host>
   *   VITE_N8N_BASE_URL=/n8n-proxy/webhook/mint
   *
   * This does nothing in a production build. A deployed site needs its address added to the
   * webhooks' "Allowed Origins (CORS)" in n8n (see n8n/README.md).
   */
  const proxyTarget = env.N8N_PROXY_TARGET?.trim();

  /**
   * `npm run dev:phone` serves the site over https with a self-made certificate and shares it on
   * the network. Phone browsers only allow the camera (QR scanner) on https pages, so use this to
   * test scanning on a phone before the site is deployed. The phone shows a one-time certificate
   * warning: choose "Advanced" then "Proceed". Plain `npm run dev` is unchanged.
   */
  const phoneMode = mode === 'phone';

  return {
    plugins: phoneMode ? [react(), basicSsl()] : [react()],
    server: proxyTarget
      ? {
          proxy: {
            '/n8n-proxy': {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/n8n-proxy/, ''),
            },
          },
        }
      : undefined,
  };
});
