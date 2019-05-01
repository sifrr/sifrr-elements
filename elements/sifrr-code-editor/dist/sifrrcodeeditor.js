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

  var css = ":host {\n  display: block;\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\npre, code {\n  width: 100%;\n  display: block; }\n\n.hljs {\n  width: 100%;\n  height: 100%;\n  font-family: Consolas,Liberation Mono,Courier,monospace;\n  font-size: 14px;\n  line-height: 18px;\n  padding: 8px;\n  margin: 0;\n  position: absolute;\n  white-space: pre-wrap;\n  top: 0;\n  left: 0; }\n\n.hljs * {\n  word-break: break-word; }\n\ntextarea {\n  z-index: 2;\n  resize: none;\n  border: none; }\n\ntextarea.loaded {\n  background: transparent !important;\n  text-shadow: 0px 0px 0px rgba(0, 0, 0, 0);\n  text-fill-color: transparent;\n  -webkit-text-fill-color: transparent; }\n\npre {\n  z-index: 1; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n<style media=\"screen\">\n  ", "\n</style>\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/${this.theme}.min.css\">\n<pre class='hljs'>\n  <code id=\"highlight\" data-sifrr-html=\"true\">\n    ${this.htmlValue}\n  </code>\n</pre>\n<textarea class='hljs' _input=\"${this.input}\"></textarea>"], ["\n<style media=\"screen\">\n  ", "\n</style>\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/\\${this.theme}.min.css\">\n<pre class='hljs'>\n  <code id=\"highlight\" data-sifrr-html=\"true\">\n    \\${this.htmlValue}\n  </code>\n</pre>\n<textarea class='hljs' _input=\"\\${this.input}\"></textarea>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const template = SifrrDom.template(_templateObject(), css);
  class SifrrCodeEditor extends SifrrDom.Element {
    static get template() {
      return template;
    }
    static observedAttrs() {
      return ['value', 'theme'];
    }
    static hljs() {
      this._hljs = this._hljs || fetch('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js').then(resp => resp.text()).then(text => new Function(text)());
      return this._hljs;
    }
    onAttributeChange() {
      this.update();
    }
    onConnect() {
      this.constructor.hljs().then(() => this.hljsLoaded());
      const txtarea = this.$('textarea');
      txtarea.addEventListener('keydown', e => {
        let keyCode = e.keyCode || e.which;
        this.$('#highlight').style.height = this.$('textarea').height;
        if (keyCode == 9) {
          e.preventDefault();
          const start = txtarea.selectionStart;
          const end = txtarea.selectionEnd;
          const tabCharacter = '  ';
          const tabOffset = 2;
          txtarea.value = txtarea.value.substring(0, start) + tabCharacter + txtarea.value.substring(end);
          txtarea.selectionStart = txtarea.selectionEnd = start + tabOffset;
          this.update();
        }
      });
      txtarea.onscroll = () => {
        this.$('pre.hljs').scrollTop = txtarea.scrollTop;
      };
    }
    input() {
      SifrrDom.Event.trigger(this, 'input');
      this.update();
    }
    hljsLoaded() {
      this.$('textarea').classList.add('loaded');
      this.update();
    }
    get htmlValue() {
      if (window.hljs) return window.hljs.highlight(this.lang, this.value.replace(/\n$/, '\n\n')).value;else return this.value.replace(/</g, '&lt;');
    }
    get theme() {
      return this.getAttribute('theme') || 'atom-one-dark';
    }
    set theme(v) {
      this.setAttribute('theme', v);
      this.update();
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
  SifrrDom.register(SifrrCodeEditor);

  return SifrrCodeEditor;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrcodeeditor.js.map
