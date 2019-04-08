const MagicString = require('magic-string');

module.exports = function () {
  return {
    name: 'sifrr', // this name will show up in warnings and errors
    transform: (code, id) => {
      const ext = id.substring(id.indexOf('.') + 1);
      const magicString = new MagicString(code);
      if (ext === 'css' || ext === 'scss' || ext === 'sass' || ext === 'sss') {
        let start, end, replacement, match;
        const pattern = /\/\*(.+)\*\//g;
        while (match = pattern.exec(code)) {
          start = match.index;
          end = start + match[0].length;
          replacement = String(match[1]).trim();
          magicString.overwrite(start, end, replacement);
        }
      }
      return { code: magicString.toString(), map: magicString.generateMap({ hires: true }) };
    }
  };
};
