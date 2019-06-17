import SifrrDom from '@sifrr/dom';
import style from './style.scss';

const template = SifrrDom.template`<style media="screen">
  ${style}
</style>`;

class SifrrCarousel extends SifrrDom.Element {
  static get template() {
    return template;
  }
}

SifrrDom.register(SifrrCarousel);

export default SifrrCarousel;
