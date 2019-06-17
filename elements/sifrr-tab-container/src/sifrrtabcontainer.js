import SifrrDom from '@sifrr/dom';
import style from './style.scss';
import animate from '@sifrr/animate';

const template = SifrrDom.template`<style media="screen">
  ${style}
</style>
<style>
  .tabs {
    height: \${this.options ? this.options.tabHeight : 'auto'};
    width: \${this.totalWidth + 'px'};
  }
  .tabs *::slotted([slot="tab"]) {
    width: \${this.tabWidth + 'px'};
    margin: 0 \${this.options ? this.options.arrowMargin + 'px' : 0};
  }
</style>
<div class="tabs">
  <slot>
  </slot>
</div>`;

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
      menu: this.$('.headings ul'),
      content: this.$('.content'),
      tabcontainer: this.$('.tabs'),
      tabs: this.$('slot[name=tab]').assignedNodes(),
      num: 1,
      tabHeight: 'auto',
      loop: false,
      animation: 'ease',
      animationTime: 300,
      scrollBreakpoint: 0.2
    }, this._attrOptions);
    if (!this.options.tabs || this.options.tabs.length < 1) return;
    this.usableWidth = this.clientWidth;
    this.totalWidth = this.usableWidth / this.options.num * this.options.tabs.length;
    this.usableWidth -= 2 * this.options.arrowMargin;
    this.tabWidth = this.usableWidth / this.options.num;
    this.setProps();
    this.update();
    this.active = this.active || 0;
  }

  setScrollEvent() {
    let me = this,
      isScrolling,
      scrollPos;
    this.options.content.onscroll = () => requestAnimationFrame(onScroll);

    function onScroll() {
      scrollPos = me.active;
      const total = me.options.content.scrollLeft / me.tabWidth;
      const t = Math.floor(total);
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

  setWindowResizeEvent() {
    window.addEventListener('resize', () => requestAnimationFrame(this.refresh.bind(this)));
  }

  setSlotChangeEvent() {
    const me = this;
    const fxn = () => {
      me.options.tabs = me.$$('slot')[1].assignedNodes();
      me.refresh();
    };
    this.$$('slot')[0].addEventListener('slotchange', fxn);
  }

  get active() {
    return this.state ? this.state.active : 0;
  }

  set active(i) {
    this.state = {
      active: i
    };
  }

  beforeUpdate() {
    if (!this.options) return;
    let i = this.state.active;
    i = this.getTabNumber(i);
    if (!isNaN(i) && i !== this.state.active) return this.active = i;
    animate({
      target: this.options.content,
      to: {
        scrollLeft: i * (this.tabWidth + 2 * this.options.arrowMargin)
      },
      time: this.options.animationTime,
      type: this.options.animation === 'none' ? () => 1 : this.options.animation
    });
    removeExceptOne(this.options.tabs, 'active', i);
    removeExceptOne(this.options.tabs, 'prev', this.getTabNumber(i - 1));
    removeExceptOne(this.options.tabs, 'next', this.getTabNumber(i + 1));
  }

  next() {
    this.active = this.state.active + this.options.step;
  }

  hasNext() {
    if (this.active === this.options.tabs.length - this.options.num) return false;
    return true;
  }

  prev() {
    this.active = this.state.active - this.options.step;
  }

  hasPrev() {
    if (this.active === 0) return false;
    return true;
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

SifrrTabContainer.defaultState = { active: 0 };

SifrrDom.register(SifrrTabContainer);
export default SifrrTabContainer;
