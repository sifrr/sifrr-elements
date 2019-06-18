/*! SifrrCarousel v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';

var css = ":host {\n  display: block;\n  width: 100%; }\n\n#header, #container {\n  position: relative; }\n\n#header {\n  padding: 0 24px; }\n\n/* count and fs */\n#count {\n  position: absolute; }\n\n#count {\n  bottom: 6px;\n  left: 6px;\n  background: rgba(255, 255, 255, 0.7);\n  border-radius: 10px;\n  font-size: 14px;\n  padding: 4px 6px; }\n\n/* Arrows css */\n.arrow {\n  position: absolute;\n  z-index: 5;\n  top: 0;\n  bottom: 0; }\n\n.arrow > * {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  margin: -6px 5px;\n  top: 50%;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px;\n  filter: drop-shadow(-1px -1px 3px #000); }\n\n.arrow.l {\n  left: 0;\n  cursor: w-resize; }\n\n.arrow.l > * {\n  left: 0;\n  transform: rotate(135deg); }\n\n.arrow.r {\n  right: 0;\n  cursor: e-resize; }\n\n.arrow.r > * {\n  right: 0;\n  transform: rotate(-45deg); }\n\n/* slot elements css */\nslot[name=preview]::slotted(*) {\n  height: 64px;\n  opacity: 0.5; }\n\nslot[name=preview]::slotted(*.active) {\n  border: 1px solid white;\n  opacity: 1; }\n\nsifrr-tab-header {\n  height: 64px; }\n";

const template = SifrrDom.template`<style media="screen">
  ${css}
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
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrcarousel.module.js.map
