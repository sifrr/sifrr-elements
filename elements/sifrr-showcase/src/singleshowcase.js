import SifrrDom from '@sifrr/dom';
import style from './style.scss';
import html from './template.html';
import '../../sifrr-code-editor';

const template = SifrrDom.template`<style media="screen">
  ${style}
</style>
${html}`;

SifrrDom.Event.add('click');

const defaultShowcase = {
  id: 1,
  name: 'Placeholder Element',
  element: 'sifrr-placeholder',
  elementUrl: '',
  isjs: true,
  variantName: '',
  variants: [
    {
      variantId: 1,
      variantName: 'variant',
      style: `#element > * {
  display: block;
  background-color: white;
  margin: auto;
}`,
      code: '<sifrr-placeholder>\n</sifrr-placeholder>',
      elState: 'return {\n\n}'
    }
  ]
};

class SifrrSingleShowcase extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['url'];
  }

  onConnect() {
    this.switchVariant();
    Sifrr.Dom.Event.addListener('click', '.variant', (e, el) => {
      if (el.matches('.variant')) this.switchVariant(el.dataset.variantId);
      if (el.matches('.variant span')) this.deleteVariant(el.parentNode.dataset.variantId);
    });
  }

  beforeUpdate() {
    this.saveVariant();
  }

  onUpdate() {
    if (this._element !== this.state.element || this._js !== this.state.isjs || this._url !== this.state.elementUrl) {
      SifrrDom.load(this.state.element, {
        js: this.state.isjs == 'true',
        url: this.state.elementUrl ? this.state.elementUrl : undefined
      }).then(() => this.$('#error').innerText = '').catch(e => this.$('#error').innerText = e.message);
      this._js = this.state.isjs;
      this._element = this.state.element;
      this._url = this.state.elementUrl;
    }
    let state;
    try {
      state = new Function(this.$('#elState').value).call(this.element());
    } catch (e) {}
    if (state && this.element() && this.element().isSifrr && this.element().state !== state) {
      this.element().state = state;
    }
  }

  onAttributeChange(name, _, value) {
    if (name === 'url') this.url = value;
  }

  createNewVariant() {
    const id = Math.max(...this.state.variants.map(s => s.variantId)) + 1;
    this.state.variants.push(Object.assign({}, {
      variantId: id,
      variantName: this.state.variantName,
      style: this.state.style,
      code: this.state.code,
      elState: this.state.elState
    }));
    this.switchVariant(id);
  }

  deleteVariant(id) {
    this.state.variants.forEach((s, i) => {
      if (s.variantId == id) {
        this.state.variants.splice(i, 1);
        if (this.state.variantId == id) this.switchVariant((this.state.variants[i] || {}).variantId);
        else this.update();
      }
    });
  }

  saveVariant() {
    const id = this.state.variantId;
    this.state.variants.forEach(s => {
      if (s.variantId == id) {
        Object.assign(s, {
          variantName: this.state.variantName,
          style: this.state.style,
          code: this.state.code,
          elState: this.state.elState
        });
      }
    });
  }

  switchVariant(id) {
    Object.assign(this.state, this.variant(id));
    this.update();
  }

  set url(v) {
    this._url = v;
    if (this.getAttribute('url') !== v) this.setAttribute('url', v);
    if (this.$('#url').value !== v) this.$('#url').value = v;
    this.loadUrl();
  }

  get url() {
    return this._url;
  }

  updateHtml(e, el) {
    const html = `<${el.value}></${el.value}>`;
    this.state = { code: html, element: el.value };
  }

  element() {
    return this.$('#element').firstElementChild;
  }

  variant(id) {
    return this.state.variants.filter(s => s.variantId == id)[0] || this.state.variants[this.state.variants.length - 1];
  }
}

SifrrSingleShowcase.defaultState = defaultShowcase;

if (window) SifrrDom.register(SifrrSingleShowcase);

export default SifrrSingleShowcase;
