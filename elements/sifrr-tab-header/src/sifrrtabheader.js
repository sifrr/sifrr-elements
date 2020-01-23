import { html } from '@sifrr/template';
import { Element, register, Event } from '@sifrr/dom';
import style from './style.scss';

const template = html`
  <style media="screen">
    ${style}
    slot::slotted(*) {
      ${el => (el.options ? el.options.style : '')}
    }
    :host {
      padding-bottom: ${el => (el.options && el.options.showunderline ? '3px' : '0')}
    }
  </style>
  <slot></slot>
  <div class="underline"></div>
`;

Event.add('click');

class SifrrTabHeader extends Element {
  static get template() {
    return template;
  }

  onPropsChange(props) {
    if (props.indexOf('options') > -1) this.refresh();
  }

  onConnect() {
    this._connected = true;
    this.$('slot').addEventListener('slotchange', this.refresh.bind(this, {}));
    this.refresh();
  }

  refresh(options) {
    this.options = Object.assign(
      {
        content: this,
        slot: this.$('slot'),
        showUnderline: true,
        line: this.$('.underline'),
        container: null
      },
      this.options,
      options
    );
    this.options.menus = this.options.slot.assignedNodes().filter(n => n.nodeType === 1);
    if (!this.options.menus || this.options.menus.length < 1) return;
    this.setCProps();
    this.active = this.active || 0;
  }

  setCProps() {
    if (!this.options.showUnderline) this.options.line.style.display = 'none';
    this.setMenuProps();
    if (this.options.container) {
      const c = this.options.container;
      c.onScrollPercent = this.setScrollPercent.bind(this);
      Event.addListener('update', c, () => (this.active = c.active));
    }
    this.setScrollPercent(0);
  }

  setMenuProps() {
    let left = 0;
    this.options.menuProps = [];
    Array.from(this.options.menus).forEach((elem, i) => {
      const width = elem.getBoundingClientRect().width;
      this.options.menuProps[i] = {
        width,
        left: left
      };
      left += width;
      elem._click = () => {
        if (this.options.container) this.options.container.active = i;
        else this.active = i;
      };
    });
    const last = this.options.menuProps[this.options.menus.length - 1];
    this.options.totalMenuWidth = last.left + last.width;
    this.$('slot').style.width = this.options.slot.style.width =
      this.options.totalMenuWidth + 1 + 'px';
  }

  setScrollPercent(total) {
    const per = total % 1,
      t = Math.floor(total);
    const left =
      this.options.menuProps[t].left * (1 - per) +
      (
        this.options.menuProps[t + 1] || {
          left: 0
        }
      ).left *
        per;
    const width =
      this.options.menuProps[t].width * (1 - per) +
      (
        this.options.menuProps[t + 1] || {
          width: 0
        }
      ).width *
        per;
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

register(SifrrTabHeader);
export default SifrrTabHeader;
