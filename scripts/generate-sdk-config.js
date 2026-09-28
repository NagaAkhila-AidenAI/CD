// Merges credentials.json (secrets) into sdk-config.base.json (non-secret settings)
// and writes the result to sdk-config.json, which is what the Pega SDK / webpack read.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const basePath = path.join(root, 'sdk-config.base.json');
const credentialsPath = path.join(root, 'credentials.json');
const outPath = path.join(root, 'sdk-config.json');

if (!fs.existsSync(credentialsPath)) {
  console.error(
    'credentials.json not found. Copy credentials.example.json to credentials.json and fill in your Launchpad OAuth credentials.'
  );
  process.exit(1);
}

const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

const merged = {
  ...base,
  authConfig: {
    ...base.authConfig,
    authorize: credentials.authorize,
    token: credentials.token,
    revoke: credentials.revoke,
    mashupClientId: credentials.mashupClientId,
    mashupClientSecret: credentials.mashupClientSecret,
    portalClientId: credentials.portalClientId,
    portalClientSecret: credentials.portalClientSecret,
    redirectUri: credentials.redirectUri
  }
};

fs.writeFileSync(outPath, JSON.stringify(merged, null, 2));
console.log('Generated sdk-config.json from sdk-config.base.json + credentials.json');
