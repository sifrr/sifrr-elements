/*! SifrrCodeEditor v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
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

  var css = ":host {\n  display: block;\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\n.hljs {\n  width: 100%;\n  height: 100%;\n  font-family: Consolas,Liberation Mono,Courier,monospace;\n  font-size: 14px;\n  line-height: 18px;\n  padding: 8px;\n  margin: 0;\n  position: absolute;\n  white-space: pre-wrap;\n  top: 0;\n  left: 0; }\n\ntextarea {\n  background: transparent !important;\n  z-index: 2;\n  resize: none;\n  text-shadow: 0px 0px 0px rgba(0, 0, 0, 0);\n  border: none;\n  text-fill-color: transparent;\n  -webkit-text-fill-color: transparent; }\n\npre {\n  z-index: 1; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n<style media=\"screen\">\n  ", "\n</style>\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/atom-one-dark.min.css\">\n<pre class='hljs'>\n  <code id=\"highight\" data-sifrr-html=\"true\">\n    ${this.htmlValue}\n  </code>\n</pre>\n<textarea class='hljs' _input=\"${this.input}\"></textarea>"], ["\n<style media=\"screen\">\n  ", "\n</style>\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/atom-one-dark.min.css\">\n<pre class='hljs'>\n  <code id=\"highight\" data-sifrr-html=\"true\">\n    \\${this.htmlValue}\n  </code>\n</pre>\n<textarea class='hljs' _input=\"\\${this.input}\"></textarea>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const template = SifrrDom.template(_templateObject(), css);
  SifrrDom.Event.add('load');
  class SifrrCodeEditor extends SifrrDom.Element {
    static get template() {
      return template;
    }
    onAttributeChange() {
      this.update();
    }
    onConnect() {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js";
      script.onLoad = this.update();
      document.body.appendChild(script);
      const txtarea = this.$('textarea');
      this.$('textarea').addEventListener('keydown', e => {
        let keyCode = e.keyCode || e.which;
        if (keyCode == 9) {
          e.preventDefault();
          const start = txtarea.selectionStart;
          const end = txtarea.selectionEnd;
          const tabCharacter = '  ';
          const tabOffset = 2;
          txtarea.value = txtarea.value.substring(0, start) + tabCharacter + txtarea.value.substring(end);
          txtarea.selectionStart = txtarea.selectionEnd = start + tabOffset;
        }
      });
    }
    input() {
      SifrrDom.Event.trigger(this, 'input');
      this.update();
    }
    get htmlValue() {
      if (window.hljs) return hljs.highlight(this.lang, this.value).value;else return this.value;
    }
    get value() {
      return this.$('textarea').value;
    }
    set value(v) {
      this.$('textarea').value = v;
      this.update();
    }
    get lang() {
      return this.getAttribute('lang') || 'html';
    }
  }
  if (window) SifrrDom.register(SifrrCodeEditor);

  return SifrrCodeEditor;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrcodeeditor.js.map
