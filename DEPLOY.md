# Deploying to Render

The site is a static React build, so it is deployed as a **Static Site** on [Render](https://render.com). Render gives it an `https://` address, which phone browsers require before they allow the camera (QR scanner).

## 1. Create the site

In the Render dashboard: **New → Static Site**, connect the GitHub repo, then use:

| Setting           | Value                          |
| ----------------- | ------------------------------ |
| Branch            | `Hein` (or the branch to show) |
| Build Command     | `npm ci && npm run build`      |
| Publish Directory | `dist`                         |

The Node version comes from the `.node-version` file in the repo.

## 2. Environment variables

Add these under **Environment**. They are the same names as in `.env.local`; the values are private, so they are not in the repo.

| Key                   | Value                                                            |
| --------------------- | ---------------------------------------------------------------- |
| `VITE_N8N_BASE_URL`   | `/n8n-proxy/webhook/mint` (uses the rewrite rule in step 3)      |
| `VITE_N8N_API_KEY`    | the shared key from `.env.local`                                 |
| `VITE_AUTH_BASE_URL`  | the login n8n address, ending in `/webhook/mint-auth`            |
| `VITE_TRAIL_BASE_URL` | optional: the trail n8n address, ending in `/webhook/mint-trail` |

`VITE_` values are built into the site's JavaScript and can be read by anyone, so the key is only a prototype deterrent.

Changing a variable needs a new deploy (**Manual Deploy → Deploy latest commit**).

## 3. Redirects / Rewrites

Add these two rules under **Redirects/Rewrites**, in this order:

| Source         | Destination                           | Action  | Why                                                                                                                 |
| -------------- | ------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| `/n8n-proxy/*` | `https://<help-chat-n8n-host>/*`      | Rewrite | Relays help, feedback and chatbot requests through the site, because that n8n only accepts `http://localhost:5173`. |
| `/*`           | `/index.html`                         | Rewrite | Lets page addresses such as `/visitor/map` work when opened or refreshed directly.                                  |

If the first rule cannot be used, set `VITE_N8N_BASE_URL` to the full n8n address instead and add the deployed site's address to **Options → Allowed Origins (CORS)** on each help / feedback / chat webhook in n8n (see `n8n/README.md`).

## 4. After the first deploy

- Open the Render address on a phone and test **Scan QR code** on the Discovery Trail.
- The QR sheets in `demo-qr/` contain plain codes (no web address), so they work on the deployed site unchanged.
- Log in once to check that the login n8n accepts the new address.

## Local development

| Command             | Use                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`       | Normal development at `http://localhost:5173`                                               |
| `npm run dev:phone` | Shares the site on the Wi-Fi over `https` (self-made certificate) to test the phone camera  |
