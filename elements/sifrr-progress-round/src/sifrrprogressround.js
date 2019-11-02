import SifrrDom from '@sifrr/dom';

import template from './template.html';
import style from './style.css';

class SifrrProgressRound extends SifrrDom.Element {
  static get template() {
    return SifrrDom.template(`<style>${style}</style>${template}`);
  }

  onPropsChange(props) {
    if (['progress', 'stroke', 'stroke-width'].filter(p => props.indexOf(p) > -1).length > 0)
      this.update();
  }
}

SifrrProgressRound.defaultState = {
  progress: 0,
  'stroke-width': 2,
  stroke: '#fff'
};
SifrrDom.register(SifrrProgressRound);

export default SifrrProgressRound;
