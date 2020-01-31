/* eslint-disable eqeqeq */

const fs = require('fs');
const { notarize } = require('electron-notarize');

let waitingOutputRunning = false;

/**
 * log & err: Functions to output a message with a prefix
 */
const log = (...args) => {
  console.log('Notarize.js: INFO:', ...args);
};
const err = (...args) => {
  console.error('Notarize.js: ERROR:', ...args);
};

/**
 * Function to start or stop the writing while waiting on notarization
 */
const controlWaitingOutput = shouldRun => {
  // Start writing waiting output, or if finished make a new line
  waitingOutputRunning = shouldRun;
  if (waitingOutputRunning) {
    runWaitingOutput();
  } else {
    process.stdout.write('\n');
  }
};

/**
 * Function to write a dot in a single line until told not to
 */
async function runWaitingOutput() {
  if (waitingOutputRunning) {
    // stdout.write instead of console.log so the dots appear on the same line
    process.stdout.write('.');
    setTimeout(runWaitingOutput, 10000);
  }
}

/**
 * Function to check for availability of notarization, and start process if everything is OK
 */
exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  if (process.env.TRAVIS_PULL_REQUEST != 'false') {
    log('This is a Pull Request build. Skipping notarization.');
    return;
  }

  if (process.env.TRAVIS_BRANCH != 'master') {
    log("This isn't a build on master branch. Skipping notarization.");
    return;
  }

  if (!process.env.APPLE_ID || !process.env.APPLE_APPPASS) {
    err('Environment variables for notarization not set. Aborting.');
    return;
  }

  if (fs.existsSync(`${appOutDir}/${appName}.app`)) {
    log(`Attempting to notarize app - ${appOutDir}/${appName}.app.`);
  } else {
    err(`File not found - ${appOutDir}/${appName}.app. Aborting.`);
    return;
  }

  log('Starting notarization. This step can take some time!');

  // Start running output, to show something is still happening
  controlWaitingOutput(true);

  return await notarize({
    appBundleId: `AMTS839RRZ.se.kits.loglady`,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APPPASS
  })
    .then(() => {
      // Stop running the output
      controlWaitingOutput(false);
      log('Done. Notarization seems to have finished successfully!');
    })
    .catch(error => {
      // Stop running the output
      controlWaitingOutput(false);
      err('An error occured while notarizing: ', error);
    });
};
