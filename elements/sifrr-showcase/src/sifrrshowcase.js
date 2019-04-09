import SifrrDom from '@sifrr/dom';
import SifrrStorage from '@sifrr/storage';
import style from './style.scss';
import './singleshowcase';

const template = SifrrDom.template`<style media="screen">
  ${style}
</style>
<div class="container">
  <div class="flex-column" id="sidemenu">
    <div class="box">
      <h1>Sifrr Showcase</h1>
      <p id="loader"></p>
      <input id="url" type="text" placeholder="Enter url here..." name="url" />
      <button type="button" name="loadUrl" _click=\${this.loadUrl}>Load from url</button>
      <p id="status"></p>
      <span class="button">
        Upload File
        <input type="file" name="file" accept="application/json" _input="\${this.loadFile}" />
      </span>
      <button type="button" name="saveFile" _click="\${this.saveFile}">Save to File</button>
      <h3>Showcases</h3>
      <input id="showcaseName" type="text" name="showcase" _input=\${this.changeName}>
      <button type="button" name="createVariant" _click="\${this.createShowcase}">Create new showcase</button>
      <style>
        #showcase\${this.state.current} {
          background: #5f616d;
        }
      </style>
      <div id="showcases" data-sifrr-repeat="\${this.state.showcases}">
        <li class="showcase" data-showcase-id="\${this.state.key}">\${this.state.name}<span>X</span></li>
      </div>
    </div>
  </div>
  <sifrr-single-showcase _update=\${this.saveShowcase}></sifrr-single-showcase>
</div>`;

const storage = new SifrrStorage({ name: 'showcases', version: '1.0' });

class SifrrShowcase extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['url'];
  }

  onAttributeChange(n, _, value) {
    if (n === 'url') this.url = value;
  }

  onConnect() {
    Sifrr.Dom.Event.addListener('click', '.showcase', (e, el) => {
      if (el.matches('.showcase')) this.switchShowcase(this.getChildIndex(el));
      if (el.matches('.showcase span')) this.deleteShowcase(this.getChildIndex(el));
    });
    this.switchShowcase(0);
    storage.get(['showcases', 'current']).then(v => {
      this._loaded = true;
      if (Array.isArray(v.showcases)) this.state = v;
      this.switchShowcase(v.current);
    });
  }

  getChildIndex(el) {
    let i = 0;
    while((el = el.previousSibling) != null) i++;
    return i;
  }

  deleteShowcase(i) {
    this.state.showcases.splice(i, 1);
    if (i == this.state.current) this.switchShowcase(this.state.current);
    else this.switchShowcase(this.state.current - 1);
  }

  createShowcase() {
    const i = this.state.showcases.push({ name: this.$('#showcaseName').value, variants: [] });
    this.switchShowcase(i - 1);
  }

  switchShowcase(i) {
    if (!this.state.showcases[i]) i = this.state.showcases.length - 1;
    this.state = { current: i };
    this.el.state = this.state.showcases[i];
    this.$('#showcases').children[i].id = 'showcase' + i;
  }

  saveShowcase() {
    delete this.el.state.name;
    this.state.showcases[this.state.current] = Object.assign(this.state.showcases[this.state.current] || {}, this.el.state);
    if (this._loaded) {
      this.$('#status').textContent = 'saving locally!';
      if (this._timeout) clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        storage.set({ showcases: this.state.showcases, current: this.state.current }).then(() => {
          this.$('#status').textContent = 'saved locally!';
        });
      }, 500);
    }
  }

  changeName() {
    this.state.showcases[this.state.current].name = this.$('#showcaseName').value;
    this.update();
  }

  get el() {
    return this.$('sifrr-single-showcase');
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
      this.state = json;
      this.$('#status').textContent = 'loaded from url!';
    }).catch((e) => {
      this.$('#status').textContent = e.message;
    });
  }

  saveFile() {
    const blob = new Blob([JSON.stringify(this.state, null, 2)], {
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
      this.state = json;
      this.$('#status').textContent = 'loaded from file!';
    };
    fr.readAsText(file);
  }
}

SifrrShowcase.defaultState = {
  current: 0,
  showcases: [{
    name: 'new'
  }]
};

if (window) SifrrDom.register(SifrrShowcase);

export default SifrrShowcase;
