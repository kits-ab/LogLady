const { readFile, writeFile } = require('fs');
const app = require('electron').app;
const path = require('path');

const reduxStateFile = () => {
  return path.join(app.getPath('userData'), 'reduxState.json');
};

const recentFiles = () => {
  return path.join(app.getPath('userData'), 'recentFiles.json');
};

const saveStateToDisk = _reduxStateValue => {
  writeFile(reduxStateFile(), _reduxStateValue, err => {
    if (err) {
      throw err;
    }
    console.log('LogLady: state has been successfully saved to disk.');
    return 'success';
  });
};

const readFileAsync = filePath => {
  return new Promise((resolve, reject) => {
    readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const loadStateFromDisk = () => {
  return readFileAsync(reduxStateFile());
};

const saveRecentFilesToDisk = _recentFiles => {
  writeFile(recentFiles(), _recentFiles, err => {
    if (err) {
      throw err;
    }
    console.log('LogLady: recent files have been successfully saved to disk.');
    return 'success';
  });
};

const loadRecentFilesFromDisk = () => {
  return readFileAsync(recentFiles());
};

module.exports = {
  saveStateToDisk,
  loadStateFromDisk,
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};
