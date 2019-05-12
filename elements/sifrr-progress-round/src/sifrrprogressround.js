import SifrrDom from '@sifrr/dom';

import template from './template.html';
import style from './style.css';

const properStyle = style.replace(/"(\${.*})"/g, '$1');

class SifrrProgressRound extends SifrrDom.Element {
  static get template() {
    return SifrrDom.template(`<style>${properStyle}</style>${template}`);
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
