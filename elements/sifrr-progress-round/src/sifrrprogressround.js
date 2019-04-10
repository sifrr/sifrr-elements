import SifrrDom from '@sifrr/dom';

import template from './template.html';

//Sifrr Lazy Loading Picture
class SifrrProgressRound extends Sifrr.Dom.Element {
  static get template() {
    return SifrrDom.template(template);
  }

  static observedAttrs() {
    return ['progress'];
  }

  onAttributeChange(n, _, v) {
    if (n === 'progress') this.state = { [n]: v };
  }
}

SifrrProgressRound.defaultState = { progress: 0 };

SifrrDom.register(SifrrProgressRound);

export default SifrrProgressRound;
