const fs = require('fs');
const lastLines = require('read-last-lines');
// const nthLine = require('nthline');
// const alwaysTail = require('always-tail');

// const writeStream = fs.createWriteStream('./src/myLittleFile.txt');
// writeStream.once('open', fd => {
//   for (let i = 0; i < 1000000; i++) {
//     writeStream.write(`${i}\n`);
//   }
//   writeStream.end();
// });

// const startAlwaysTail = filePath => {
//   let tail = new alwaysTail(filePath, '\n', { interval: 500 });
//   tail.on('line', line => {
//     console.log(line);
//   });
//   tail.on('error', err => {
//     console.log(err);
//   });
// };

const readLastLines = (filePath, numberOfLines) => {
  return new Promise((resolve, reject) => {
    lastLines
      .read(filePath, numberOfLines)
      .then(lines => {
        resolve(lines);
      })
      .catch(err => {
        reject(err);
      });
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

const readFile = (filePath, enc) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, enc, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

// const readNthLines = async (filePath, lineNumber, numberOfLines) => {
//   let i;
//   let lines = {};
//   for (i = 0; i < numberOfLines; i++) {
//     await nthLine(lineNumber + i - 1, filePath).then(line => {
//       lines[lineNumber + i] = line;
//     });
//   }
//   console.log(JSON.stringify(lines, null, 2));
// };

// //Call on getNumberOfLines
// getNumberOfLines('myLittleFile.txt').then(lineCount => {
//   console.log(lineCount);
// });

//Call on readFile
// readFile('./src/myLittleFile.txt', null)
//   .then(data => {
//     console.log(data);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// //Call on readLastLinesa
// readLastLines('myLittleFile.txt', 5)
//   .then(lines => {
//     console.log(lines);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// //Call on readNthLines
// readNthLines('./src/myLittleFile.txt', 1, 5);

//Call on startAlwaysTail
// startAlwaysTail('./src/myLittleFile.txt');

module.exports = {
  readFile: readFile,
  readLastLines: readLastLines,
  getNumberOfLines: getNumberOfLines
  // readNthLines: readNthLines
};
