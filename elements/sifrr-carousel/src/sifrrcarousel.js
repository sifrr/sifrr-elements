import { html } from '@sifrr/template';
import { Element, Event, register } from '@sifrr/dom';
import style from './style.scss';
import '../../sifrr-tab-header/src/sifrrtabheader';
import '../../sifrr-tab-container/src/sifrrtabcontainer';

const template = html`
  <style media="screen">
    ${style}
    ${el => el.state.style || ''}
  </style>
  <div id="bg">
    <div id="cross">X</div>
  </div>
  <div id="content">
    <sifrr-tab-container
      :style=${el => ({
        height: el.imageHeight
      })}
    >
      <slot name="content"></slot>
    </sifrr-tab-container>
    <span id="count">${el => `${el.container.active + 1}/${el.container.total}`}</span>
  </div>
  <div id="preview">
    <div class="arrow l">
      <span></span>
    </div>
    <div class="arrow r">
      <span></span>
    </div>
    <sifrr-tab-header ::options="${{ showUnderline: false }}">
      <slot name="preview"></slot>
    </sifrr-tab-header>
  </div>
`;

Event.add('click');
class SifrrCarousel extends Element {
  static get template() {
    return template;
  }

  constructor() {
    super();
    this.state = { style: '' };
    this.container = this.$('sifrr-tab-container');
    this.header = this.$('sifrr-tab-header');
  }

  onConnect() {
    this.container.refresh({
      slot: this.$('slot[name=content]')
    });
    this.header.refresh({
      slot: this.$('slot[name=preview]'),
      container: this.container
    });

    // refresh when images are loaded
    this._rel = this._rel || this.refresh.bind(this);
    Array.from(this.$$('img', false)).forEach(img => img.addEventListener('load', this._rel));

    Event.addListener('click', this, (e, t) => {
      if (
        (t.matches('[slot=content]') || t.matches('[slot=content] *')) &&
        !t.matches('.fullscreen *')
      )
        this.fullScreen(true);
      else if (t.matches('#bg') || t.matches('#bg *')) this.fullScreen(false);
      else if (t.matches('.arrow.l') || t.matches('.arrow.l span')) this.container.prev();
      else if (t.matches('.arrow.r') || t.matches('.arrow.r span')) this.container.next();
    });
    this.container._update = () => {
      this.$('#count').textContent = `${this.container.active + 1}/${this.container.total}`;
    };
  }

  fullScreen(on = true) {
    if (on) {
      this.classList.add('fullscreen');
    } else {
      this.classList.remove('fullscreen');
    }
    this.refresh();
  }

  refresh() {
    this.container.refresh();
    this.header.refresh();
  }
}

register(SifrrCarousel);

export default SifrrCarousel;
