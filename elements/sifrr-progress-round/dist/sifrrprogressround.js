/*! SifrrProgressRound v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom'], factory) :
  (global = global || self, global.SifrrProgressRound = factory(global.Sifrr.Dom));
}(this, function (SifrrDom) { 'use strict';

  SifrrDom = SifrrDom && SifrrDom.hasOwnProperty('default') ? SifrrDom['default'] : SifrrDom;

  const template = "<div class=\"circle back\">\n</div>\n<div class=\"circle front ${this.state.progress > 50 ? 'over50' : ''}\">\n  <div class=\"bar right\"></div>\n  <div class=\"bar left\"></div>\n</div>\n";

  var css = ":host {\n  display: inline-block;\n  position: relative;\n}\n\n:host * {\n  box-sizing: border-box;\n}\n\n/* absolute positioning */\n.circle, .bar {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  top: 0;\n  left: 0;\n}\n\n/* borders */\n.back.circle {\n  border: 2px solid rgba(255, 255, 255, 0.6);\n}\n\n.bar, .over50 .bar.right {\n  border: 2px solid \"${this.hasAttribute('dark') ? '#000000' : '#ffffff'}\";\n}\n\n/* clipping */\n.front.circle {\n  /* right half */\n  clip-path: polygon(50% 0, 101% 0%, 100% 100%, 50% 100%);\n}\n\n.front.circle.over50 {\n  /* full */\n  clip-path: polygon(0 0, 101% 0, 100% 100%, 0 100%);\n}\n\n.bar.left {\n  /* left half */\n  clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);\n}\n\n.over50 .bar.right {\n  /* right half */\n  clip-path: polygon(50% 0, 101% 0%, 100% 100%, 50% 100%);\n}\n\n/* progress */\n.bar.left {\n  transform: rotate(\"${this.state.progress * 360 / 100}\"deg)\n}\n\n.bar.right {\n  display: none;\n}\n\n.over50 .bar.right {\n  display: block;\n}\n";

  const properStyle = css.replace(/"(\${.*})"/g, '$1');
  class SifrrProgressRound extends SifrrDom.Element {
    static get template() {
      return SifrrDom.template("<style>".concat(properStyle, "</style>").concat(template));
    }
    static observedAttrs() {
      return ['progress'];
    }
    get progress() {
      return this._state.progress;
    }
    set progress(v) {
      return this.state = {
        progress: v
      };
    }
    onAttributeChange(n, _, v) {
      if (n === 'progress') this.state = {
        [n]: v
      };
    }
  }
  SifrrProgressRound.defaultState = {
    progress: 0
  };
  SifrrDom.register(SifrrProgressRound);

  return SifrrProgressRound;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrprogressround.js.map
