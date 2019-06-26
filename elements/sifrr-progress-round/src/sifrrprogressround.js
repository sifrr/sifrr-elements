import SifrrDom from '@sifrr/dom';

import template from './template.html';
import style from './style.css';

class SifrrProgressRound extends SifrrDom.Element {
  static get template() {
    return SifrrDom.template(`<style>${style}</style>${template}`);
  }

  static syncedAttrs() {
    return ['progress', 'stroke', 'stroke-width'];
  }

  onAttributeChange(n, _, v) {
    if (n === 'progress' || n === 'stroke' || n === 'stroke-width') this.state = { [n]: Number(v) };
  }
}

SifrrProgressRound.defaultState = {
  progress: 0,
  'stroke-width': 2,
  stroke: '#fff'
};
SifrrDom.register(SifrrProgressRound);

export default SifrrProgressRound;
