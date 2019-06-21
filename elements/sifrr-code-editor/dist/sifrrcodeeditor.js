/*! SifrrCodeEditor v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom'], factory) :
  (global = global || self, global.SifrrCodeEditor = factory(global.Sifrr.Dom));
}(this, function (SifrrDom) { 'use strict';

  SifrrDom = SifrrDom && SifrrDom.hasOwnProperty('default') ? SifrrDom['default'] : SifrrDom;

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  var css = ":host {\n  display: block;\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\ntextarea {\n  resize: none;\n  border: none; }\n\ntextarea, .CodeMirror {\n  height: 100%;\n  width: 100%; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/codemirror@", "/lib/codemirror.css\">\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/codemirror@", "/theme/${this.getTheme()}.css\">\n<style media=\"screen\">\n  ", "\n</style>\n<textarea></textarea>"], ["\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/codemirror@", "/lib/codemirror.css\">\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/codemirror@", "/theme/\\${this.getTheme()}.css\">\n<style media=\"screen\">\n  ", "\n</style>\n<textarea></textarea>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const CM_VERSION = '5.48.0';
  const template = SifrrDom.template(_templateObject(), CM_VERSION, CM_VERSION, css);
  class SifrrCodeEditor extends SifrrDom.Element {
    static get template() {
      return template;
    }
    static observedAttrs() {
      return ['value', 'theme', 'lang'];
    }
    static syncedAttrs() {
      return ['theme'];
    }
    static cm() {
      this._cm = this._cm || SifrrDom.Loader.executeJS("https://cdn.jsdelivr.net/npm/codemirror@".concat(CM_VERSION, "/lib/codemirror.js"));
      return this._cm;
    }
    onAttributeChange(n, _, v) {
      if (this._cmLoaded) {
        if (n === 'theme') this.cm.setOption('theme', v);
        if (n === 'lang') this.cm.setOption('mode', this.getTheme());
      }
    }
    onConnect() {
      this.constructor.cm().then(() => this.cmLoaded());
    }
    input() {
      SifrrDom.Event.trigger(this, 'input');
      this.update();
    }
    cmLoaded() {
      SifrrDom.Loader.executeJS("https://cdn.jsdelivr.net/npm/codemirror@".concat(CM_VERSION, "/mode/").concat(this.lang, "/").concat(this.lang, ".js")).then(() => {
        this.cm = window.CodeMirror.fromTextArea(this.$('textarea'), {
          value: this.$('textarea').value,
          mode: this.lang,
          htmlMode: true,
          theme: this.getTheme(),
          indentUnit: 2,
          tabSize: 2,
          lineNumbers: true
        });
        this.cm.on('change', this.input.bind(this));
        this._cmLoaded = true;
      });
    }
    getTheme() {
      return this.theme ? this.theme.split(' ')[0] : 'dracula';
    }
    get value() {
      if (this._cmLoaded) return this.cm.getValue();else return this.$('textarea').value;
    }
    set value(v) {
      if (v === this.value) return;
      if (this._cmLoaded) return this.cm.setValue(v);else this.$('textarea').value = v;
    }
    get lang() {
      const attr = this.getAttribute('lang');
      if (!attr || attr === 'html') return 'xml';
      return attr;
    }
  }
  SifrrDom.register(SifrrCodeEditor);

  return SifrrCodeEditor;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrcodeeditor.js.map
