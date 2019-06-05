const path = require('path');

const { loadDir } = require('@sifrr/dev');
const allConfigs = [];

loadDir({
  dir: path.resolve('./elements'),
  onFile: (file) => {
    if (file.match(/elements\/[a-z-]+\/sifrr-[a-z-]+\/rollup\.config\.js/)) {
      Array.prototype.push.apply(allConfigs, require(file));
    }
  },
  deep: 1
});

Array.prototype.push.apply(allConfigs, require('./rollup.base')('Sifrr.Elements', __dirname, true));
module.exports = allConfigs;
