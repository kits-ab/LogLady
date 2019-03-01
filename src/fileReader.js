const fs = require('fs');
const chokidar = require('chokidar');
// const Tail = require('tail').Tail;
const lastLines = require('read-last-lines');

const readPos = fs.createReadStream('myLittleFile.txt');

// readPos.on('open', () => {
//   readPos.pipe(process.stdout);
// });

// const writeStream = fs.createWriteStream('myLittleFile.txt');
// writeStream.once('open', fd => {
//   for (let i = 0; i < 1000000; i++) {
//     writeStream.write(`${i}\n`);
//   }
//   writeStream.end();
// });

// let tailOptions = { follow: true };
// const tail = new Tail('myLittleFile.txt');

// tail.on('line', data => {
//   console.log(data);
// });

// tail.on('error', err => {
//   console.log('ERROR: ', err);
// });

function readLastLines(filePath, numberOfLines) {
  lastLines.read(filePath, numberOfLines).then(lines => {
    console.log(lines);
  });
}

function getNumberOfLines(filePath) {
  return new Promise((resolve, reject) => {
    let lineCount = 0;
    fs.createReadStream(filePath)
      .on('data', buffer => {
        let idx = -1;
        lineCount--;
        do {
          idx = buffer.indexOf(10, idx + 1);
          lineCount++;
        } while (idx !== -1);
      })
      .on('end', () => {
        console.log(lineCount);
        resolve(lineCount);
      })
      .on('error', reject);
  });
}

function readFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data);
    console.log('DONE!');
  });
}

function readFileWithCreateReadStream(filePath) {}

// getNumberOfLines('myLittleFile.txt');
// getNumberOfLines('text.txt');

// readFile('myLittleFile.txt');
// readFile('text.txt');

readLastLines('myLittleFile.txt', 100);
// readLastLines('text.txt', 10);
