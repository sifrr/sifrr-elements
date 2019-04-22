import SifrrDom from '@sifrr/dom';
import style from './style.scss';
import { animate } from '../../../helpers/animate';

const template = SifrrDom.template`<style media="screen">
  ${style}
</style>
<style>
  .tabs {
    height: \${this.options ? this.options.tabHeight : 'auto'};
    width: \${this.totalWidth + 'px'};
  }
  .headings {
    display: \${this.headingDisplay};
    background: \${this.options ? this.options.background : 'transparent'};
  }
  .content *::slotted([slot="tab"]) {
    width: \${this.tabWidth + 'px'};
    margin: 0 \${this.options ? this.options.arrowMargin + 'px' : 0};
  }
  .arrow {
    width: \${this.options ? this.options.arrowWidth : '20px'};
  }
</style>
<div class="headings">
  <ul>
    <slot name="heading">
    </slot>
  </ul>
  <div class="underline"></div>
</div>
<div class="content">
  <div class="arrow l" _click=\${this.prev}>
    <span></span>
  </div>
  <div class="arrow r" _click=\${this.next}>
    <span></span>
  </div>
  <div class="tabs">
    <slot name="tab">
    </slot>
  </div>
</div>`;

function removeExceptOne(elements, name, index) {
  if (elements instanceof HTMLElement) elements = elements.children;
  for (let j = 0; j < elements.length; j++) {
    j !== index && elements[j] !== index ? elements[j].classList.remove(name) : elements[j].classList.add(name);
  }
}

//Simple tabs
class SifrrTabs extends SifrrDom.Element {
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
      menus: this.$('slot[name=heading]').assignedNodes(),
      tabs: this.$('slot[name=tab]').assignedNodes(),
      la: this.$('.arrow.l'),
      ra: this.$('.arrow.r'),
      line: this.$('.underline'),
      num: 1,
      showArrows: false,
      arrowMargin: 0,
      arrowWidth: '20px',
      showMenu: true,
      step: 1,
      tabHeight: 'auto',
      showUnderline: true,
      loop: false,
      animation: 'ease',
      animationTime: 300,
      scrollBreakpoint: 0.2,
      background: '#714cfe'
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

  setProps() {
    if (!this.options.showArrows) {
      this.options.la.style.display = 'none';
      this.options.ra.style.display = 'none';
    } else {
      this.options.la.style.display = 'block';
      this.options.ra.style.display = 'block';
      Array.from(this.options.tabs).forEach(e => e.style.margin = `0 ${this.margin}px`);
    }
    if (!this.options.showUnderline) this.options.line.style.display = 'none';
    if (this.options.showMenu) {
      this.headingDisplay = 'block';
      this.options.line.style.width = this.options.menus[0].offsetWidth + 'px';
      this.setMenuProps();
    } else this.headingDisplay = 'none';
  }

  setMenuProps() {
    let left = 0;
    this.options.menuProps = [];
    Array.from(this.options.menus).forEach((elem, i) => {
      this.options.menuProps[i] = {
        width: elem.offsetWidth,
        left: left
      };
      left += elem.offsetWidth;
      elem._click = () => this.active = i;
    });
    const last = this.options.menuProps[this.options.menus.length - 1];
    this.options.menu.style.width = last.left + last.width + 5 * this.options.menus.length + 'px';
    const active = this.options.menuProps[this.active];
    this.options.line.style.left = active.left + 'px';
    this.options.line.style.width = active.width + 'px';
  }

  setScrollEvent() {
    let me = this,
      isScrolling,
      scrollPos;
    this.options.content.onscroll = () => requestAnimationFrame(onScroll);

    function onScroll() {
      scrollPos = me.active;
      const total = me.options.content.scrollLeft / me.tabWidth;
      const per = total % 1;
      const t = Math.floor(total);
      if (me.options.showMenu) {
        const left = me.options.menuProps[t].left * (1 - per) + (me.options.menuProps[t + 1] || {
          left: 0
        }).left * per;
        const width = me.options.menuProps[t].width * (1 - per) + (me.options.menuProps[t + 1] || {
          width: 0
        }).width * per;
        me.options.line.style.left = left + 'px';
        me.options.line.style.width = width + 'px';
        me.options.menu.parentElement.scrollLeft = left + (width - me.tabWidth) / 2;
      }
      clearTimeout(isScrolling);
      isScrolling = setTimeout(function() {
        if (total - scrollPos < -me.options.scrollBreakpoint) {
          me.active = t;
        } else if (total - scrollPos > +me.options.scrollBreakpoint) {
          me.active = t + 1;
        } else {
          me.active = scrollPos;
        }
      }, 66);
    }
  }

  setWindowResizeEvent() {
    window.addEventListener('resize', () => requestAnimationFrame(this.refresh.bind(this)));
  }

  setSlotChangeEvent() {
    const me = this;
    const fxn = () => {
      me.options.menus = me.$$('slot')[0].assignedNodes();
      me.options.tabs = me.$$('slot')[1].assignedNodes();
      me.refresh();
    };
    this.$$('slot')[0].addEventListener('slotchange', fxn);
    this.$$('slot')[1].addEventListener('slotchange', fxn);
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
    removeExceptOne(this.options.menus, 'active', i);
    removeExceptOne(this.options.menus, 'prev', this.getTabNumber(i - 1));
    removeExceptOne(this.options.menus, 'next', this.getTabNumber(i + 1));
    if (this.options.showArrows) {
      this.options.la.style.display = this.hasPrev() || this.options.loop ? 'block' : 'none';
      this.options.ra.style.display = this.hasNext() || this.options.loop ? 'block' : 'none';
    }
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

SifrrTabs.defaultState = { active: 0 };

SifrrDom.register(SifrrTabs);
export default SifrrTabs;
