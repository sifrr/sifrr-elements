/*! SifrrInclude v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom'], factory) :
  (global = global || self, global.SifrrInclude = factory(global.Sifrr.Dom));
}(this, function (SifrrDom) { 'use strict';

  SifrrDom = SifrrDom && SifrrDom.hasOwnProperty('default') ? SifrrDom['default'] : SifrrDom;

  class SifrrInclude extends SifrrDom.Element {
    static syncedAttrs() {
      return ['url', 'type'];
    }
    onConnect() {
      let preffix = '',
          suffix = '';
      if (this.type === 'js') {
        preffix = '<script>';
        suffix = '</script>';
      } else if (this.type === 'css') {
        preffix = '<style>';
        suffix = '</style>';
      }
      if (this.url) {
        fetch(this.url).then(r => r.text()).then(text => {
          this.innerHTML = preffix + text + suffix;
        });
      }
    }
  }
  SifrrDom.register(SifrrInclude);

  return SifrrInclude;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrinclude.js.map
