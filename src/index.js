const fs = require('fs');

const multiply = (a, b) => a * b;

const double = a => multiply(a, 2);

const readPackageJson = callback => {
  fs.readFile('./package.json', { encoding: 'utf-8' }, callback);
};

module.exports = { multiply, double, readPackageJson };
