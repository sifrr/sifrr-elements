const keys = [
  'name',
  'version',
  'description',
  'license',
  'repository',
  'author',
  'bugs',
  'homepage',
  'private',
  'main',
  'module',
  'browser',
  'bin',
  'browserslist',
  'keywords',
  'scripts',
  'files'
];

function sortObject(obj) {
  const ret = {};
  keys.forEach(k => {
    if (obj[k]) ret[k] = obj[k];
  });
  return ret;
}

module.exports = obj => {
  return JSON.stringify(sortObject(obj), null, 2);
};
