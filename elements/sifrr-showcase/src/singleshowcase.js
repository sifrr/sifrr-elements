import { html } from '@sifrr/template';
import { Element, register, Event, load } from '@sifrr/dom';
import HtmlString from './template.js';

import '../../sifrr-code-editor/src/sifrrcodeeditor';

import { variantStore } from './stores';
import { toggleFullScreen } from '../../../helpers/makefullscreen';

const template = html`
  <style>
    ${el => el.store.getActiveValue().style}
  </style>
  ${HtmlString}
`;

Event.add('click');

class SifrrSingleShowcase extends Element {
  static get template() {
    return template;
  }

  static observedAttributees() {
    return ['url'];
  }

  static get useShadowRoot() {
    return false;
  }

  constructor() {
    super();
    this.state = {};
    variantStore.addListener(() => this.update());
    this.store = variantStore;
  }

  onConnect() {
    Event.addListener('click', '#variants', (e, el) => {
      if (el.matches('li')) this.store.setActive(this.getChildIndex(el));
      if (el.matches('li span')) this.store.delete(this.getChildIndex(el.parentNode));
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
      load(this.state.element, {
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
    const currentTime = Date.now();
    if (this._stateFxnTimeout) clearTimeout(this._stateFxnTimeout);
    if (this._lastStateRun && currentTime - this._lastStateRun < 500) {
      this._stateFxnTimeout = setTimeout(
        this.runStateFunction.bind(this),
        currentTime - this._lastStateRun
      );
    } else {
      this.runStateFunction();
    }
  }

  runStateFunction() {
    this._lastStateRun = Date.now();
    let state;
    try {
      state = new Function(this.$('#elState').value).call(this.element());
    } catch (e) {
      window.console.warn(e);
    }
    if (state && this.element() && this.element().isSifrr) {
      this.element().setState(state);
    }
  }

  createNewVariant() {
    this.store.add({
      name: this.$('#variantName').value,
      style: this.$('#css').value,
      code: this.$('#elCode').value,
      elState: this.$('#elState').value
    });
  }

  updateHtml(e, el) {
    const html = `<${el.value}></${el.value}>`;
    this.store.setActiveValue({ code: html, element: el.value });
  }

  element() {
    return this.$('#element').firstElementChild;
  }
}

register(SifrrSingleShowcase);

export default SifrrSingleShowcase;
