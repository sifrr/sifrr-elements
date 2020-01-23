import { Element, register } from '@sifrr/dom';

import template from './template';

class SifrrProgressRound extends Element {
  static get template() {
    return template;
  }

  onPropsChange(props) {
    if (['progress', 'stroke', 'strokeWidth'].filter(p => props.indexOf(p) > -1).length > 0)
      this.update();
  }
}

register(SifrrProgressRound);

export default SifrrProgressRound;
