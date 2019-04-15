import SifrrDom from '@sifrr/dom';
import template from './template.html';

class SifrrShimmer extends Sifrr.Dom.Element {
  static get template() {
    return SifrrDom.template(template);
  }
}

SifrrDom.register(SifrrShimmer);

export default SifrrShimmer;
