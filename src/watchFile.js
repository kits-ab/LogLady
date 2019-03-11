const seeMeFile = './src/testFileForWatch.log';

const chokidar = require('chokidar');

chokidar.watch(seeMeFile).on('all', (event, path) => {
  console.log(event, path);
});
