import SifrrDom from '@sifrr/dom';
import style from './style.scss';

const template = SifrrDom.template`<style media="screen">
  ${style}
  slot::slotted(*) {
    \${this.options ? this.options.style : ''}
  }
  :host {
    padding-bottom: \${this.options.showUnderline ? '3px' : '0'};
  }
</style>
<slot>
</slot>
<div class="underline"></div>`;

class SifrrTabHeader extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['options'];
  }

  onConnect() {
    this._connected = true;
    this.$('slot').addEventListener('slotchange', this.refresh.bind(this, {}));
    this.refresh();
  }

  onAttributeChange(n, _, v) {
    if (n === 'options') {
      this._attrOptions = JSON.parse(v || '{}');
      if (this._connected) this.refresh();
    }
  }

  refresh(options) {
    this._options = Object.assign({
      content: this,
      slot: this.$('slot'),
      showUnderline: true,
      line: this.$('.underline'),
      container: null
    }, this._options, options);
    this.options = Object.assign({}, this._options, this._attrOptions);
    this.options.menus = this.options.slot.assignedNodes().filter(n => n.nodeType === 1);
    if (!this.options.menus || this.options.menus.length < 1) return;
    this.setProps();
    this.active = this.active || 0;
  }

  setProps() {
    if (!this.options.showUnderline) this.options.line.style.display = 'none';
    this.setMenuProps();
    if (this.options.container) {
      const c = this.options.container;
      c.onScrollPercent = this.setScrollPercent.bind(this);
      SifrrDom.Event.addListener('update', c, () => this.active = c.active);
    }
    this.setScrollPercent(0);
  }

  setMenuProps() {
    let left = 0;
    this._smt = this._smt || this.setMenuProps.bind(this);
    this.options.menuProps = [];
    Array.from(this.options.menus).forEach((elem, i) => {
      const width = elem.getBoundingClientRect().width;
      this.options.menuProps[i] = {
        width,
        left: left
      };
      left += width;
      elem.addEventListener('load', this._smt);
      elem._click = () => {
        if (this.options.container) this.options.container.active = i;
        else this.active = i;
      };
    });
    const last = this.options.menuProps[this.options.menus.length - 1];
    this.options.totalMenuWidth = last.left + last.width;
    this.$('slot').style.width = this.options.slot.style.width = this.options.totalMenuWidth + 'px';
  }

  setScrollPercent(total) {
    const per = total % 1, t = Math.floor(total);
    const left = this.options.menuProps[t].left * (1 - per) + (this.options.menuProps[t + 1] || {
      left: 0
    }).left * per;
    const width = this.options.menuProps[t].width * (1 - per) + (this.options.menuProps[t + 1] || {
      width: 0
    }).width * per;
    this.options.line.style.left = left + 'px';
    this.options.line.style.width = width + 'px';
    this.scrollLeft = left + (width - this.clientWidth) / 2;
    if (per === 0) {
      this._active = t;
      this.update();
    }
  }

  get active() {
    return this._active || 0;
  }

  set active(i) {
    this._active = i;
    this.setScrollPercent(i);
    this.update();
  }

  onUpdate() {
    if (!this.options) return;
    for (let j = 0, l = this.options.menus.length; j < l; j++) {
      this.options.menus[j].classList[j === this.active ? 'add' : 'remove']('active');
    }
  }
}

SifrrDom.register(SifrrTabHeader);
export default SifrrTabHeader;
