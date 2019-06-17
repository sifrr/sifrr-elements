import SifrrDom from '@sifrr/dom';
import style from './style.scss';
import animate from '@sifrr/animate';

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
</style>
<slot class="tabs">
</slot>`;

function removeExceptOne(elements, name, index) {
  if (elements instanceof HTMLElement) elements = elements.children;
  for (let j = 0; j < elements.length; j++) {
    j !== index && elements[j] !== index ? elements[j].classList.remove(name) : elements[j].classList.add(name);
  }
}

class SifrrTabContainer extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['options'];
  }

  onConnect() {
    this._connected = true;
    this.refresh();
    this.setWindowResizeEvent();
    this.setSlotChangeEvent();
    this.setScrollEvent();
  }

  onAttributeChange(n, _, v) {
    if (n === 'options') {
      this._attrOptions = JSON.parse(v || '{}');
      if (this._connected) this.refresh();
    }
  }

  refresh() {
    this.options = Object.assign({
      content: this,
      tabs: this.$('slot').assignedNodes().filter(n => n.nodeType === 1),
      num: 1,
      animation: 'spring',
      animationTime: 300,
      scrollBreakpoint: 0.3
    }, this._attrOptions);
    if (!this.options.tabs || this.options.tabs.length < 1) return;
    this.tabWidth = this.clientWidth / this.options.num;
    this.totalWidth = this.tabWidth * this.options.tabs.length;
    this.active = this._active || 0;
  }

  setScrollEvent() {
    let me = this,
      isScrolling,
      scrollPos;
    this.options.content.addEventListener('scroll', onScroll);

    function onScroll() {
      scrollPos = me.active;
      const total = me.options.content.scrollLeft / me.tabWidth;
      const t = Math.floor(total);
      me.onScrollPercent(total);
      clearTimeout(isScrolling);
      isScrolling = setTimeout(function() {
        if (total - scrollPos < -me.options.scrollBreakpoint) {
          me.active = t;
        } else if (total - scrollPos > +me.options.scrollBreakpoint) {
          me.active = t + 1;
        } else {
          me.active = scrollPos;
        }
      }, 100);
    }
  }

  onScrollPercent() {}

  setWindowResizeEvent() {
    window.addEventListener('resize', () => requestAnimationFrame(this.refresh.bind(this)));
  }

  setSlotChangeEvent() {
    const me = this;
    const fxn = () => {
      me.options.tabs = me.$('slot').assignedNodes();
      me.refresh();
    };
    this.$('slot').addEventListener('slotchange', fxn);
  }

  get active() {
    return this._active;
  }

  set active(i) {
    this._active = this.getTabNumber(i);
    this.update();
  }

  beforeUpdate() {
    if (!this.options) return;
    const i = this._active;
    animate({
      target: this.options.content,
      to: {
        scrollLeft: i * this.tabWidth
      },
      time: this.options.animationTime,
      type: this.options.animation === 'none' ? () => 1 : this.options.animation
    });
    removeExceptOne(this.options.tabs, 'active', i);
    removeExceptOne(this.options.tabs, 'prev', this.getTabNumber(i - 1));
    removeExceptOne(this.options.tabs, 'next', this.getTabNumber(i + 1));
  }

  next() {
    this.active += 1;
  }

  hasNext() {
    if (this.active === this.options.tabs.length - this.options.num) return false;
    return true;
  }

  prev() {
    this.active -= 1;
  }

  hasPrev() {
    return this.active === 0 ? false : true;
  }

  getTabNumber(i) {
    const l = this.options.tabs.length;
    const num = this.options.num;
    i = i < 0 ? i + l : i % l;
    if (i + num - 1 >= l) {
      i = this.options.loop ? 0 : l - num;
    }
    return i;
  }
}

SifrrDom.register(SifrrTabContainer);
export default SifrrTabContainer;
