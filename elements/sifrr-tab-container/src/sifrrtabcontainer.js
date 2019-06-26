import SifrrDom from '@sifrr/dom';
import style from './style.scss';
import animate from '@sifrr/animate';

const template = SifrrDom.template`<style media="screen">
  ${style}
</style>
<style media="screen">
  .tabs {
    width: \${this.totalWidth};
  }
  .tabs::slotted(*) {
    width: \${this.tabWidth};
  }
</style>
<slot class="tabs">
</slot>`;

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
    window.addEventListener('resize', () => requestAnimationFrame(this.refresh.bind(this)));
    this.options.slot.addEventListener('slotchange', this.refresh.bind(this, {}));
    this.setScrollEvent();
  }

  onAttributeChange(n, _, v) {
    if (n === 'options') {
      this._attrOptions = JSON.parse(v || '{}');
      if (this._connected) this.refresh();
    }
  }

  refresh(options) {
    this._options = Object.assign(
      {
        content: this,
        slot: this.$('slot'),
        num: 1,
        animation: 'spring',
        animationTime: 300,
        scrollBreakpoint: 0.3,
        loop: false
      },
      this._options,
      options
    );
    this.options = Object.assign({}, this._options, this._attrOptions);
    this.options.tabs = this.options.slot.assignedNodes().filter(n => n.nodeType === 1);
    this.total = this.options.tabs.length;
    if (!this.options.tabs || this.options.tabs.length < 1) return;
    if (this.options.num === 'auto') {
      this.tabWidth = 'auto';
      this._totalWidth = this.options.tabs.reduce((a, b) => a + b.getBoundingClientRect().width, 0);
      this.totalWidth = this._totalWidth + 'px';
    } else {
      this._tabWidth = this.getBoundingClientRect().width / this.options.num;
      this.tabWidth = this._tabWidth + 'px';
      this._totalWidth = this._tabWidth * this.options.tabs.length;
      this.totalWidth = this._totalWidth + 'px';
      this.active = typeof this._active === 'number' ? this._active : 0;
    }
  }

  setScrollEvent() {
    let me = this,
      isScrolling,
      scrollPos;
    if (this.options.num !== 'auto') this.options.content.addEventListener('scroll', onScroll);

    function onScroll() {
      scrollPos = me.active;
      const total = me.options.content.scrollLeft / me._tabWidth;
      const t = Math.round(total);
      me.onScrollPercent(total);
      clearTimeout(isScrolling);
      isScrolling = setTimeout(function() {
        if (total - scrollPos < -me.options.scrollBreakpoint) {
          me.active = Math.min(t, scrollPos - 1);
        } else if (total - scrollPos > +me.options.scrollBreakpoint) {
          me.active = Math.max(t, scrollPos + 1);
        } else {
          me.active = scrollPos;
        }
      }, 50);
    }
  }

  onScrollPercent() {}

  get active() {
    return this._active;
  }

  set active(i) {
    this._active = this.getTabNumber(i);
    this.update();
  }

  onUpdate() {
    if (!this.options || this.options.num === 'auto') return;
    const i = this._active;
    animate({
      target: this.options.content,
      to: {
        scrollLeft: i * this._tabWidth
      },
      time: this.options.animationTime,
      type: this.options.animation === 'none' ? () => 1 : this.options.animation
    });
    for (let j = 0, l = this.options.tabs.length; j < l; j++) {
      const el = this.options.tabs[j];
      if (j === i) {
        if (el.onActive && !el.classList.contains('active')) el.onActive();
        el.classList.add('active');
      } else {
        if (el.onInactive && el.classList.contains('active')) el.onInactive();
        el.classList.remove('active');
      }
    }
  }

  next() {
    this.options.num === 'auto'
      ? (this.options.content.scrollLeft += this._totalWidth / 2)
      : (this.active += 1);
  }

  hasNext() {
    if (this.active === this.options.tabs.length - this.options.num) return false;
    return true;
  }

  prev() {
    this.options.num === 'auto'
      ? (this.options.content.scrollLeft -= this._totalWidth / 2)
      : (this.active -= 1);
  }

  hasPrev() {
    return this.active === 0 ? false : true;
  }

  getTabNumber(i) {
    const l = this.options.tabs.length;
    if (l < 1) return 0;
    const num = this.options.num;
    i = i < 0 ? i + l : i % l;
    if (i + num - 1 >= l) {
      i = this.options.loop ? i % l : l - num;
    }
    return i;
  }
}

SifrrDom.register(SifrrTabContainer);
export default SifrrTabContainer;
