import SifrrDom from '@sifrr/dom';

import template from './template.html';
import style from './style.css';

class SifrrProgressRound extends SifrrDom.Element {
  static get template() {
    return SifrrDom.template(`<style>${style}</style>${template}`);
  }

  onPropsChange(props) {
    if (['progress', 'stroke', 'strokeWidth'].filter(p => props.indexOf(p) > -1).length > 0)
      this.update();
  }
}

SifrrDom.register(SifrrProgressRound);

export default SifrrProgressRound;
