import SifrrDom from '@sifrr/dom';
import style from './style.scss';

const template = SifrrDom.template`<style media="screen">
  ${style}
</style>
<style media="screen">
  \${this.state.style || ''}
</style>
<div id="container">
  <sifrr-tab-container>
    <slot name="content"></slot>
  </sifrr-tab-container>
  <span id="count"></span>
</div>
<div id="header">
  <div class="arrow l">
    <span></span>
  </div>
  <div class="arrow r">
    <span></span>
  </div>
  <sifrr-tab-header options='{ "showUnderline": false }'>
    <slot name="preview"></slot>
  </sifrr-tab-header>
</div>`;

class SifrrCarousel extends SifrrDom.Element {
  static get template() {
    return template;
  }

  onConnect() {
    this.container = this.$('sifrr-tab-container');
    this.header = this.$('sifrr-tab-header');
    this.container.refresh({
      slot: this.$('slot[name=content]')
    });
    this.header.refresh({
      slot: this.$('slot[name=preview]'),
      container: this.container
    });

    SifrrDom.Event.addListener('click', this, (e, t) => {
      if (t.matches('.arrow.l') || t.matches('.arrow.l span')) this.container.prev();
      if (t.matches('.arrow.r') || t.matches('.arrow.r span')) this.container.next();
    });
    this.container._update = () => {
      this.$('#count').textContent = `${this.container.active + 1}/${this.container.total}`;
    };
  }
}

SifrrCarousel.defaultState = { style: '' };
SifrrDom.register(SifrrCarousel);

export default SifrrCarousel;
