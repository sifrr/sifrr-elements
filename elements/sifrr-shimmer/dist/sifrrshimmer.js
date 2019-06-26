/*! SifrrShimmer v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom'], factory) :
  (global = global || self, global.SifrrShimmer = factory(global.Sifrr.Dom));
}(this, function (SifrrDom) { 'use strict';

  SifrrDom = SifrrDom && SifrrDom.hasOwnProperty('default') ? SifrrDom['default'] : SifrrDom;

  var css = ":host {\n  background: linear-gradient(\n    to right,\n    '${this.bgColor}' 4%,\n    '${this.fgColor}' 25%,\n    '${this.bgColor}' 36%\n  );\n  display: inline-block;\n  animation: shimmer 2.5s linear 0s infinite;\n  background-size: 2000px 100%;\n}\n@keyframes shimmer {\n  0% {\n    background-position: -2000px 0;\n  }\n  100% {\n    background-position: 2000px 0;\n  }\n}\n";

  const properStyle = css.replace(/"(\${[^"]*})"/g, '$1');
  function rgbToHsl(r = 0, g = 0, b = 0) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;
    if (max == min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
  class SifrrShimmer extends SifrrDom.Element {
    static syncedAttrs() {
      return ['color', 'bg-color', 'fg-color'];
    }
    static get template() {
      return SifrrDom.template("<style>".concat(properStyle, "</style>"));
    }
    get bgColor() {
      return this['bg-color'] || this.colora(0.15);
    }
    get fgColor() {
      return this['fg-color'] || this.colora(0);
    }
    colora(point) {
      const hsl = rgbToHsl(...(this.color || '170, 170, 170').replace(/ /g, '').split(',').map(Number));
      const l = Math.min(hsl[2] + (this.isLight() ? point : -1 * point), 1);
      return "hsl(".concat(hsl[0] * 359, ", ").concat(hsl[1] * 100, "%, ").concat(l * 100, "%)");
    }
    isLight() {
      return this.hasAttribute('light');
    }
  }
  SifrrDom.register(SifrrShimmer);

  return SifrrShimmer;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrshimmer.js.map
