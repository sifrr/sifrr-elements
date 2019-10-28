import SifrrDom, { bindStoresToElement } from '@sifrr/dom';
import html from './template.html';

import '../../sifrr-code-editor/src/sifrrcodeeditor';

import { variantStore } from './stores';
import { toggleFullScreen } from '../../../helpers/makefullscreen';

const template = SifrrDom.template`<style>
\${this.state.style}
</style>
${html}`;

SifrrDom.Event.add('click');

class SifrrSingleShowcase extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['url'];
  }

  static get useShadowRoot() {
    return false;
  }

  constructor() {
    super();
    bindStoresToElement(this, [variantStore]);
    this.store = variantStore;
  }

  onConnect() {
    SifrrDom.Event.addListener('click', '.variant', (e, el) => {
      if (el.matches('.variant')) this.store.setActive(this.getChildIndex(el));
      if (el.matches('.variant span')) this.store.delete(this.getChildIndex(el.parentNode));
    });
    this.$('#fs')._click = () => {
      toggleFullScreen(this.$('#element'));
    };
  }

  getChildIndex(el) {
    let i = 0;
    while ((el = el.previousElementSibling) != null) i++;
    return i;
  }

  beforeUpdate() {
    if (!this.state.element) return;
    if (
      this._element !== this.state.element ||
      this._js !== this.state.isjs ||
      this._url !== this.state.elementUrl
    ) {
      SifrrDom.load(this.state.element, {
        js: this.state.isjs == 'true',
        url: this.state.elementUrl ? this.state.elementUrl : undefined
      })
        .then(() => (this.$('#error').innerText = ''))
        .catch(e => (this.$('#error').innerText = e.message));
      this._js = this.state.isjs;
      this._element = this.state.element;
      this._url = this.state.elementUrl;
    }
  }

  onUpdate() {
    if (this._stateFxnTimeout) clearTimeout(this._stateFxnTimeout);
    this._stateFxnTimeout = setTimeout(this.runStateFunction.bind(this), 500);
  }

  runStateFunction() {
    let state;
    try {
      state = new Function(this.$('#elState').value).call(this.element());
    } catch (e) {
      window.console.warn(e);
    }
    if (state && this.element() && this.element().isSifrr && this.element().state !== state) {
      this.element().state = state;
    }
  }

  createNewVariant() {
    this.store.add({
      variantId: id,
      variantName: this.state.variantName,
      style: this.state.style || '',
      code: this.state.code || '',
      elState: this.state.elState || ''
    });
  }

  updateHtml(e, el) {
    const html = `<${el.value}></${el.value}>`;
    this.state = { code: html, element: el.value };
  }

  element() {
    return this.$('#element').firstElementChild;
  }
}

SifrrDom.register(SifrrSingleShowcase);

export default SifrrSingleShowcase;
