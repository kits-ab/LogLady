const fs = require('fs');

const seeMeFile = './src/testFileForWatch.log';

console.log(`Watching for file changes on ${seeMeFile}`);

let fsWait = false;

fs.watch(seeMeFile, (event, filename) => {
  if (filename) {
    if (fsWait) {
      return;
    }
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    console.log(`${filename} file changed`);
  }
});
