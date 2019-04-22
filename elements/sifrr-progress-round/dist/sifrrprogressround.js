/*! SifrrProgressRound v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom'], factory) :
  (global = global || self, global.SifrrProgressRound = factory(global.Sifrr.Dom));
}(this, function (SifrrDom) { 'use strict';

  SifrrDom = SifrrDom && SifrrDom.hasOwnProperty('default') ? SifrrDom['default'] : SifrrDom;

  const template = "<style media=\"screen\">\n  * {\n    box-sizing: border-box;\n  }\n\n  .circle {\n    position: relative;\n    border: 2px solid rgba(255, 255, 255, 0.6);\n    padding: 0;\n    margin: 0;\n    width: 100%;\n    height: 100%;\n    border-radius: 50%;\n  }\n\n  .left-half, .bar, .f50-bar {\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    height: 100%;\n    border-radius: 50%;\n    top: 0;\n    left: 0;\n  }\n\n  .left-half {\n    width: calc(100% + 4px);\n    height: calc(100% + 4px);\n    margin: -2px;\n    clip-path: polygon(50% 0, 100% 0%, 100% 100%, 50% 100%);\n  }\n\n  .circle.over50 .left-half {\n    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);\n  }\n\n  .bar {\n    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);\n    border: 2px solid #ffffff;\n  }\n\n  .circle.over50 .f50-bar {\n    clip-path: polygon(50% 0, 100% 0%, 100% 100%, 50% 100%);\n    border: 2px solid #ffffff;\n    box-sizing: border-box;\n  }\n\n  .circle:not(.over50) .f50-bar {\n    display: none\n  }\n\n  .circle .bar {\n    transform: rotate(${this.state.progress * 360 / 100}deg)\n  }\n</style>\n<div class=\"circle ${this.state.progress > 50 ? 'over50' : ''}\">\n  <div class=\"left-half\">\n    <div class=\"f50-bar\"></div>\n    <div class=\"bar\"></div>\n  </div>\n</div>\n";

  class SifrrProgressRound extends Sifrr.Dom.Element {
    static get template() {
      return SifrrDom.template(template);
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
