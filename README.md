# GymLog - PWA (React + Tailwind) — Ready release

This package is a ready-to-publish skeleton for **GymLog**, a Progressive Web App to log gym sessions (Push/Pull/Legs), offline-first storage (IndexedDB via localforage), i18n (Arabic/English), and optional Google Sheets sync via Apps Script.

## What's included
- React + Vite project files
- Tailwind setup files (tailwind.config.cjs, postcss.config.cjs)
- PWA manifest.json and a simple service worker
- Google Apps Script example (`google_apps_script/sync.gs`)
- Simple placeholder icons folder

## Quick start (development)
1. Extract the zip.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Tailwind
This project uses Tailwind. The CSS file `src/styles.css` uses Tailwind directives. Ensure `tailwindcss` and `postcss` are installed (they are in devDependencies).

## PWA notes
- `manifest.json` included.
- `src/service-worker.js` is a simple cache-first service worker; adjust during production.
- To enable install prompt, serve the built site over HTTPS or use localhost.

## Google Sheets Sync (optional)
1. Open Google Sheets, create a new sheet.
2. Extensions → Apps Script → Create project, replace the code with `google_apps_script/sync.gs`.
3. Deploy → New deployment → Select "Web app".
4. Set access (e.g., "Anyone" or "Anyone with Google account"), click Deploy.
5. Copy the web app URL and use it as your sync endpoint in the app (not yet wired in UI — you can add it manually in code or I can wire it).

## Made by
This app header includes: `made by : Mohammed Abdallah`

## Next steps I can do for you (free)
- Wire the Google Apps Script endpoint into app UI (Settings -> Sync).
- Add History screen, Charts (stats), and PR tracking.
- Polish animations and UI details, replace icons.

If you want me to wire the sync URL into the UI and enable automatic push/pull, tell me and I will update the package and give you a new zip.
