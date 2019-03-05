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
  return new Promise(
    (resolve, reject) => {
      lastLines
        .read(filePath, numberOfLines)
        .then(lines => {
          resolve(lines);
        })
        .catch(err => {
          reject(err);
        });
    }
    // lastLines.read(filePath, numberOfLines).then(lines => {
    //   process.send({
    //     type: 'lastLines',
    //     data: lines
    //   });
    //   console.log(lines);
    // });
  );
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
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

  // fs.readFile(filePath, (err, data) => {
  //   if (err) {
  //     process.send({
  //       type: 'Read File error',
  //       data: err
  //     });
  //     throw err;
  //   } else {
  //     process.send({
  //       type: 'readFile',
  //       data: data
  //     });
  //   }
  //   console.log(data);
  //   console.log('DONE!');
  // });
};

//wrong order because of async.
const readNthLines = async (filePath, lineNumber, numberOfLines) => {
  let i;
  for (i = 0; i < numberOfLines; i++) {
    await nthLine(lineNumber + i, filePath).then(line => {
      console.log(line);
    });
  }
};

//Call on getNumberOfLines
getNumberOfLines('myLittleFile.txt').then(lineCount => {
  console.log(lineCount);
});

//Call on readFile
readFile('myLittleFile.txt')
  .then(data => {
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });

//Call on readLastLinesa
readLastLines('myLittleFile.txt', 5)
  .then(lines => {
    console.log(lines);
  })
  .catch(err => {
    console.log(err);
  });

//Call on readNthLines
readNthLines('myLittleFile.txt', 100, 15);

module.exports = {
  readFile: readFile,
  readLastLines: readLastLines,
  getNumberOfLines: getNumberOfLines,
  readNthLines: readNthLines
};
