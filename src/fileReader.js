const fs = require('fs');
const readline = require('readline');
const chokidar = require('chokidar');

const lineReader = require('readline').createInterface({
  input: fs.createReadStream('myLittleFile.txt')
});

lineReader.on('line', line => {
  console.log('Line:', line);
});

const read = readline.createInterface({
  input: fs.createReadStream('myLittleFile.txt'),
  output: process.stdout,
  console: true
});

read.on('line', line => {
  console.log('line------:', line);
});

chokidar.watch('.', { ignored: /(^|[/\\])\../ }).on('all', (event, path) => {
  console.log(event, path);
});

fs.readFile('myLittleFile.txt', 'utf-8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
