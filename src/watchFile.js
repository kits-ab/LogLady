const fs = require('fs');
const md5 = require('md5');

const seeMeFile = './src/testFileForWatch.log';

console.log(`Watching for file changes on ${seeMeFile}`);

let md5Prevoius = null;
let fsWait = false;

fs.watch(seeMeFile, (event, filename) => {
  if (filename) {
    if (fsWait) {
      return;
    }
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    const md5Current = md5(fs.readFileSync(seeMeFile));
    if (md5Current === md5Prevoius) {
      return;
    }
    md5Prevoius = md5Current;
    console.log(`${filename} file changed`);
  }
});
