import SifrrDom from '@sifrr/dom';
import style from './style.scss';

const template = SifrrDom.template`<style media="screen">
  ${style}
</style>
<style media="screen">
  .tabs {
    width: \${this.totalWidth + 'px'};
  }
  .tabs::slotted(*) {
    width: \${this.tabWidth + 'px'};
  }
</style>`;

function removeExceptOne(elements, name, index) {
  if (elements.nodeType === 1) elements = elements.children;
  for (let j = 0, l = elements.length; j < l; j++) {
    j === index || elements[j] === index ? elements[j].classList.add(name) : elements[j].classList.remove(name);
  }
}

class SifrrTabHeader extends SifrrDom.Element {
  static get template() {
    return template;
  }
}

SifrrDom.register(SifrrTabHeader);
export default SifrrTabHeader;
