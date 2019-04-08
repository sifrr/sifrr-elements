const path = require('path');

const loadDir = require('./scripts/test/loaddir');
const allConfigs = [];

loadDir(path.resolve('./elements'), (file) => {
  if (file.match(/elements\/[a-z\-]+\/sifrr-[a-z\-]+\/rollup\.config\.js/)) {
    Array.prototype.push.apply(allConfigs, require(file));
  }
}, 2);

module.exports = allConfigs;
