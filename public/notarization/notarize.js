const fs = require('fs');
const { notarize } = require('electron-notarize');

const log = (...args) => {
  console.log('Notarize.js: INFO:', ...args);
};

const err = (...args) => {
  console.error('Notarize.js: ERROR:', ...args);
};

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  if (fs.existsSync(`${appOutDir}/${appName}.app`)) {
    log(`Attempting to notarize app - ${appOutDir}/${appName}.app.`);
  } else {
    err(`File not found - ${appOutDir}/${appName}.app.`);
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_APPPASS) {
    if (process.env.CI && process.env.TRAVIS) {
      log(
        'Environment variables for notarization not set. If this is a Pull Request build this is expected. Skipping notarization.'
      );
    } else {
      err('Environment variables for notarization not set.');
    }
    return;
  }

  log(
    'Starting notarization. This step can take some time with no further output if successful!'
  );

  return await notarize({
    appBundleId: `AMTS839RRZ.se.kits.loglady`,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APPPASS
  });
};
