const path = require('path');
const { getRollupConfig } = require('@sifrr/dev');
const version = require('./package.json').version;

const external = [
  '@sifrr/dom',
  '@sifrr/fetch',
  '@sifrr/storage'
];
const globals = {
  '@sifrr/dom': 'Sifrr.Dom',
  '@sifrr/fetch': 'Sifrr.Fetch',
  '@sifrr/storage': 'Sifrr.Storage'
};
const footer = '/*! (c) @aadityataparia */';

function moduleConfig(name, root, minify = false, isModule = false) {
  const filename = name.toLowerCase();
  const banner = `/*! ${name} v${version} - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */`;
  return getRollupConfig({
    name,
    inputFile: path.join(root, `./src/${filename}.js`),
    outputFolder: path.join(root, './dist'),
    outputFileName: filename,
    minify,
    type: isModule ? 'module' : 'browser'
  }, {
    output: {
      banner,
      footer,
      globals
    },
    external
  });
}

module.exports = (name, __dirname, isBrowser = true) => {
  let ret = [];
  if (isBrowser) {
    ret = [
      moduleConfig(name, __dirname),
      moduleConfig(name, __dirname, true)
    ];
  }
  ret.push(moduleConfig(name, __dirname, false, true));

  return ret;
};
