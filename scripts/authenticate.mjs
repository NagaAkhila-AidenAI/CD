#!/usr/bin/env node
// Standalone Launchpad authentication, outside the React app.
//
// WHY THIS EXISTS
// ----------------
// Useful when you want an access token to test the DX API directly (curl,
// Postman) without running the full webpack dev server. It still requires
// you to log in once through a real browser window — your OAuth client is
// registered as "Authorization Code" grant, which by design requires a
// human in the loop. No script can skip that step; this just automates
// everything around it (printing the sign-in link, catching the redirect,
// exchanging the code for a token).
//
// IMPORTANT: this binds a local HTTP server on the redirectUri's port
// (6006) to catch the OAuth redirect. Stop `npm start` first if it's
// running, since only one process can listen on that port at a time.
//
// USAGE
// -----
//   npm run authenticate
//
// The sign-in link is printed in the terminal; paste it into Chrome or Edge.
//
// On success, the token is written to .access_token.json (gitignored) at
// the project root, for use like:
//   curl -H "Authorization: Bearer $(node -pe "require('./.access_token.json').access_token")" \
//     https://<your-launchpad-server>/api/v1/casetypes

import fs from 'node:fs';
import { PegaAuth } from '@pega/auth';

const SDK_CONFIG_PATH = 'sdk-config.json';
const TOKEN_PATH = '.access_token.json';

if (!fs.existsSync(SDK_CONFIG_PATH)) {
  console.error(`${SDK_CONFIG_PATH} not found. Run "npm run generate-sdk-config" first.`);
  process.exit(1);
}

const { authConfig } = JSON.parse(fs.readFileSync(SDK_CONFIG_PATH, 'utf8'));
const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

const placeholderFields = ['authorize', 'mashupClientId', 'mashupClientSecret'].filter((key) =>
  String(authConfig[key] || '').startsWith('REPLACE_WITH_')
);
if (placeholderFields.length > 0) {
  console.error(`credentials.json still has placeholders for: ${placeholderFields.join(', ')}`);
  process.exit(1);
}

const config = {
  serverType: 'launchpad',
  authService: authConfig.authService || 'pega',
  grantType: 'authCode',
  tokenUri: authConfig.token,
  authorizeUri: authConfig.authorize,
  clientId: authConfig.mashupClientId,
  clientSecret: authConfig.mashupClientSecret,
  redirectUri: authConfig.redirectUri,
  useNodeFetch: false, // native fetch (undici) — set NODE_USE_ENV_PROXY=1 + HTTPS_PROXY/HTTP_PROXY if you're behind a corporate proxy
  noPKCE: true, // Launchpad OAuth client is Confidential
  ...(credentials.isolationId ? { isolationId: credentials.isolationId } : {}),
  winTitle: 'Launchpad Authentication',
  // This window is opened by the OS browser (not window.open), so it can't auto-close itself —
  // this message is just so it doesn't show a blank/"undefined" page while you close the tab.
  winBodyHtml: 'Authenticated - you can close this tab.'
};

// @pega/auth uses a global `open` if one exists instead of launching the OS default browser.
// Print the sign-in link instead, so it can be pasted into any browser (Chrome/Edge) — the
// default browser on this machine isn't always a regular one. The returned object stands in
// for the popup window the library polls for `closed`.
globalThis.open = (url) => {
  console.log('\nOpen this link in Chrome or Edge and sign in with your Launchpad company email:\n');
  console.log(url);
  console.log('\nWaiting for the sign-in to complete...');
  return { closed: false, close() {} };
};

console.log(`Authenticating to ${authConfig.authorize} ...`);

try {
  const auth = new PegaAuth(config);
  const token = await auth.login();
  if (token?.token_type) {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));
    console.log(`Authenticated successfully — token written to ${TOKEN_PATH}`);
  } else {
    console.error('Authentication failed:', JSON.stringify(token?.errors ?? token));
    process.exit(1);
  }
} catch (e) {
  console.error('Authentication failed:', e?.message || e);
  process.exit(1);
}
