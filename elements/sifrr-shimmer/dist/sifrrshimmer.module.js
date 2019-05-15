/*! SifrrShimmer v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';

var css = ":host {\n  background: linear-gradient(to right, \"${this.bgColor}\" 4%, \"${this.fgColor}\" 25%, \"${this.bgColor}\" 36%);\n  display: inline-block;\n  animation: shimmer 2.5s linear 0s infinite;\n  background-size: 2000px 100%;\n}\n@keyframes shimmer{\n  0% { background-position: -2000px 0 }\n  100% { background-position: 2000px 0 }\n}\n";

const properStyle = css.replace(/"(\${[^"]*})"/g, '$1');
function rgbToHsl(r = 0, g = 0, b = 0) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max) {
    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    case g: h = (b - r) / d + 2; break;
    case b: h = (r - g) / d + 4; break;
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
    return SifrrDom.template(`<style>${properStyle}</style>`);
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
    return `hsl(${hsl[0] * 359}, ${hsl[1] * 100}%, ${l * 100}%)`;
  }
  isLight() {
    return this.hasAttribute('light');
  }
}
SifrrDom.register(SifrrShimmer);

export default SifrrShimmer;
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrshimmer.module.js.map
