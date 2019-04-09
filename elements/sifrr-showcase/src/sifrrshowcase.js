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
      <p id="urlStatus"></p>
      <span class="button">
        Upload File
        <input type="file" name="file" accept="application/json" _input="\${this.loadFile}" />
      </span>
      <button type="button" name="saveFile" _click="\${this.saveFile}">Save to File</button>
      <label for="showcases">Showcases</label>
      <input id="showcaseName" type="text" name="showcases">
      <button type="button" name="createVariant" _click="\${this.createShowcase}">Create new showcase</button>
      <div data-sifrr-repeat="\${this.state.showcases}">
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

  onConnect() {
    this.switchShowcase(0);
    storage.get(['showcases', 'current']).then(v => {
      if (Array.isArray(v.showcases)) this.state = v;
    });
  }

  createShowcase() {
    const i = this.state.showcases.push({ name: this.$('#showcaseName').value });
    this.switchShowcase(i - 1);
  }

  switchShowcase(i) {
    this.state = { current: i };
    this.el.state = this.state.showcases[i];
  }

  saveShowcase() {
    this.state.showcases[this.state.current] = this.el.state;
    storage.set({ showcases: this.state.showcases, current: this.state.current });
    this.update();
  }

  get el() {
    return this.$('sifrr-single-showcase');
  }

  loadUrl() {
    this._url = this.$('#url').value;
    window.fetch(this._url).then((resp) => resp.json()).then(json => {
      this.state = json;
      this.$('#loader').textContent = 'loaded from url!';
    }).catch((e) => {
      this.$('#urlStatus').textContent = e.message;
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
      this.$('#loader').textContent = 'loaded from file!';
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
