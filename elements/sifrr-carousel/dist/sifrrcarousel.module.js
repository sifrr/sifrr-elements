/*! SifrrCarousel v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';

var css = "";

const template = SifrrDom.template`<style media="screen">
  ${css}
</style>`;
class SifrrCarousel extends SifrrDom.Element {
  static get template() {
    return template;
  }
}
SifrrDom.register(SifrrCarousel);

export default SifrrCarousel;
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrcarousel.module.js.map
