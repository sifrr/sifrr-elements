import SifrrDom from '@sifrr/dom';

import template from './template.html';

class SifrrProgressRound extends SifrrDom.Element {
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
    return this.state = { progress: v };
  }

  onAttributeChange(n, _, v) {
    if (n === 'progress') this.state = { [n]: v };
  }
}

SifrrProgressRound.defaultState = { progress: 0 };

SifrrDom.register(SifrrProgressRound);

export default SifrrProgressRound;
