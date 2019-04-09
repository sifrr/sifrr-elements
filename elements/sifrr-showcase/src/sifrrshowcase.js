import SifrrDom from '@sifrr/dom';
import SifrrStorage from '@sifrr/storage';
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
  name: 'new',
  element: 'sifrr-placeholder',
  style: `#element > * {
  display: block;
  background-color: white;
  margin: auto;
}`,
  code: '<sifrr-placeholder>\n</sifrr-placeholder>',
  elState: 'return {\n\n}',
  isjs: 'true',
  elementUrl: ''
};
const storage = new SifrrStorage({ name: 'sifrr-showcase', version: 1 });
const showcases = [];

class SifrrShowcase extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['url'];
  }

  onConnect() {
    storage.get(['showcases', 'current']).then((res) => {
      if (Array.isArray(res.showcases) && res.showcases.length > 0) {
        showcases.push(...res.showcases);
      } else showcases.push(defaultShowcase);
      this.switchShowcase(res.current || defaultShowcase.id);
    });
    this.$('#loader').textContent = 'loaded from storage!';
    SifrrDom.Event.addListener('click', '.showcase', (e, el) => {
      if (el.matches('.showcase')) {
        const id = el.dataset.showcaseId;
        this.switchShowcase(id);
      }
    });
    SifrrDom.Event.addListener('click', '.showcase span', (e, el) => {
      const id = el.parentNode.dataset.showcaseId;
      this.deleteShowcase(id);
    });
  }

  onUpdate() {
    if (this._element !== this.state.element || this._js !== this.state.isjs) {
      SifrrDom.load(this.state.element, {
        js: this.state.isjs == 'true',
        url: this.state.elementUrl ? this.state.elementUrl : undefined
      }).then(() => this.$('#error').innerText = '').catch(e => this.$('#error').innerText = e.message);
      this._js = this.state.isjs;
      this._element = this.state.element;
    }
    let state;
    try {
      state = new Function(this.$('#elState').value).call(this.element());
    } catch (e) {}
    if (state && this.element() && this.element().isSifrr && this.element().state !== state) {
      this.element().state = state;
    }
    this.$('#saver').textContent = 'saving in storage...';
    if (this._autoSaver) clearTimeout(this._autoSaver);
    this._autoSaver = setTimeout(() => {
      delete this._autoSaver;
      this.saveShowcase().then(() => {
        this.$('#saver').textContent = 'saved in storage!';
      });
    }, 1000);
  }

  onAttributeChange(name, _, value) {
    if (name === 'url') this.url = value;
  }

  createNewVariant() {
    const i = showcases.length;
    showcases[i] = Object.assign({}, defaultShowcase, { id: Math.max(...showcases.map(s => s.id)) + 1, name: this.$('#variantName').value });
    this.switchShowcase(i);
  }

  deleteShowcase(id) {
    showcases.forEach((s, i) => {
      if (s.id == id) showcases.splice(i, 1);
    });
    this.update();
  }

  saveShowcase() {
    const i = this.state.id;
    showcases.forEach(s => {
      if (s.id == i) {
        Object.assign(s, this.state);
      }
    });
    return storage.set('showcases', showcases);
  }

  switchShowcase(id) {
    this.state = Object.assign({}, showcases.filter(s => s.id == id)[0] || showcases[0]);
    storage.set('current', id);
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

  loadUrl() {
    this._url = this.$('#url').value;
    window.fetch(this._url).then((resp) => resp.json()).then(json => {
      showcases.splice(0, showcases.length);
      showcases.push(...json.showcases);
      this.switchShowcase(json.current);
      this.$('#loader').textContent = 'loaded from url!';
    }).catch((e) => {
      this.$('#urlStatus').textContent = e.message;
    });
  }

  saveFile() {
    const blob = new Blob([JSON.stringify({
      current: this.state.id,
      showcases: showcases
    })], {
      type: 'application/json'
    });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'showcases';
    a.click();
  }

  loadFile(e, el) {
    const file = el.files[0];
    const fr = new FileReader();
    fr.onload = () => {
      const json = JSON.parse(fr.result);
      showcases.splice(0, showcases.length);
      showcases.push(...json.showcases);
      this.switchShowcase(json.current);
      this.$('#loader').textContent = 'loaded from file!';
    };
    fr.readAsText(file);
  }

  updateHtml(e, el) {
    const html = `<${el.value}></${el.value}>`;
    this.state = { code: html, element: el.value };
  }

  element() {
    return this.$('#element').firstElementChild;
  }

  allShowcases() {
    return showcases;
  }
}

SifrrShowcase.defaultState = defaultShowcase;

if (window) SifrrDom.register(SifrrShowcase);

export default SifrrShowcase;
