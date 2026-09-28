# Launchpad Custom Front End

Custom React UI for Pega Launchpad, built with the [Pega React SDK](https://github.com/pegasystems/pega-launchpad-agent-skills) (`@pega/react-sdk-components` + `@pega/constellationjs`) and Material UI, following the `launchpad-ux-custom-frontend` skill pattern.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Fill in `credentials.json` with your Launchpad OAuth 2.0 credentials (this is the only file that holds secrets):
   - `authorize` — cluster frontend authorize URL
   - `mashupClientId` / `mashupClientSecret` (and matching `portalClientId` / `portalClientSecret`)
   - `token` / `revoke` / `redirectUri` — leave as `localhost:6006` unless you change the dev server port

   `credentials.json` is gitignored — `credentials.example.json` is the checked-in template. Never put real secrets in `sdk-config.base.json` or commit `credentials.json`.
3. Fill in the non-secret app settings in `sdk-config.base.json`:
   - `serverConfig.appAlias` — your Launchpad application alias
   - `serverConfig.appMashupCaseType` — case type short name (also update `CASE_TYPE` in `src/components/Dashboard/index.tsx`)
4. In `webpack.config.js`, replace `devServer.proxy[0].target` with your Launchpad app server URL.
5. Register `http://localhost:6006/` as an allowed redirect URI on the OAuth client in Launchpad, and configure CORS for that origin.

## Run

```
npm start
```

`npm start` (and `npm run build:dev` / `build:prod`) automatically regenerate `sdk-config.json` from `sdk-config.base.json` + `credentials.json` first — that generated file is what the Pega SDK and webpack actually read, and it's gitignored since it contains merged secrets. To regenerate it manually: `npm run generate-sdk-config`.

The dev server runs at `http://localhost:6006`. It proxies `/dx` requests to your Launchpad server and redirects to Cognito for login on first load.

## Adding screens

New screens go in `src/components/<ScreenName>/index.tsx` and are wired into `AppShell`. Shared Pega state is available via the `usePega()` hook (`isPegaReady`, `createCase`, `PegaContainer`). Match Launchpad's look by using the CSS variables and MUI theme in `src/theme/index.ts`.
