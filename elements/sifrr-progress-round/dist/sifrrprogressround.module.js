/*! SifrrProgressRound v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';

const template = "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" preserveAspectRatio=\"xMinYMin meet\" width=\"100%\" height=\"100%\" viewBox=\"0 0 60 60\">\n  <circle cx=\"30\" cy=\"30\" r=\"28\" fill=\"none\" stroke=\"rgba(255, 255, 255, 0.6)\" stroke-width=\"${this.state['stroke-width']}\"/>\n  <circle id=\"top\" cx=\"30\" cy=\"30\" r=\"28\" fill=\"none\" stroke=\"${this.state.stroke}\" stroke-width=\"${this.state['stroke-width']}\" stroke-dasharray=\"188.5\" stroke-dashoffset=\"${(100 - this.state.progress) / 100 * 188.5}\"/>\n</svg>";

var css = ":host {\n  display: inline-block;\n}\n\n/* rotate svg */\nsvg {\n  transform: rotate(-90deg);\n}\n";

class SifrrProgressRound extends SifrrDom.Element {
  static get template() {
    return SifrrDom.template(`<style>${css}</style>${template}`);
  }
  static syncedAttrs() {
    return ['progress', 'stroke', 'stroke-width'];
  }
  onAttributeChange(n, _, v) {
    if (n === 'progress' || n === 'stroke' || n === 'stroke-width') this.state = { [n]: Number(v) };
  }
}
SifrrProgressRound.defaultState = { progress: 0, 'stroke-width': 2, stroke: '#fff' };
SifrrDom.register(SifrrProgressRound);

export default SifrrProgressRound;
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrprogressround.module.js.map
