const fs = require('fs');
const chokidar = require('chokidar');
// const Tail = require('tail').Tail;
const lastLines = require('read-last-lines');
const nthLine = require('nthline');

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

const readLastLines = (filePath, numberOfLines) => {
  lastLines.read(filePath, numberOfLines).then(lines => {
    console.log(lines);
  });
};

const getNumberOfLines = filePath => {
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
        resolve(lineCount);
      })
      .on('error', reject);
  });
};

const readFile = filePath => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data);
    console.log('DONE!');
  });
};

//wrong order because of async.
const readNthLines = (filePath, lineNumber, numberOfLines) => {
  let i;
  for (i = 0; i < numberOfLines; i++) {
    nthLine(lineNumber + i, filePath).then(line => {
      console.log(line);
    });
  }
};

// getNumberOfLines('myLittleFile.txt').then(lineCount => {
//   console.log(lineCount);
// });
// getNumberOfLines('text.txt').then(lineCount => {
//   console.log(lineCount);
// });

// readFile('myLittleFile.txt');
// readFile('text.txt');

// readLastLines('myLittleFile.txt', 5);
// readLastLines('text.txt', 10);

readNthLines('myLittleFile.txt', 100, 5);
// readNthLines('text.txt', 100, 5);
