/*! SifrrShimmer v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';

const template = "<style media=\"screen\">\n  :host {\n    background: #f3f3f3;\n    background-image: linear-gradient(to right, #f3f3f3 0%, #e8e8e8 30%, #f6f7f8 60%, #f3f3f3 100%);\n    background-repeat: no-repeat;\n    display: inline-block;\n    animation: placeHolderShimmer 1s linear 0s infinite normal forwards;\n  }\n  @keyframes placeHolderShimmer{\n    0% { background-position: -${this.offsetWidth}px 0 }\n    100% { background-position: ${this.offsetWidth}px 0 }\n  }\n</style>\n";

class SifrrShimmer extends Sifrr.Dom.Element {
  static get template() {
    return SifrrDom.template(template);
  }
}
SifrrDom.register(SifrrShimmer);

export default SifrrShimmer;
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrshimmer.module.js.map
