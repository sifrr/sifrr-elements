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
      <h1 class="font head">Sifrr Showcase</h1>
      <p class="font" id="loader"></p>
      <input id="url" type="text" placeholder="Enter url here..." name="url" />
      <button type="button" name="loadUrl" _click=\${this.loadUrl}>Load from url</button>
      <p class="font" id="status"></p>
      <span class="button font">
        Upload File
        <input type="file" name="file" accept="application/json" _input="\${this.loadFile}" />
      </span>
      <button class="font" type="button" name="saveFile" _click="\${this.saveFile}">Save to File</button>
      <h3 class="font head">Showcases</h3>
      <input id="showcaseName" type="text" name="showcase" _input=\${this.changeName} value=\${this.state.showcases[this.state.current].name}>
      <button class="font" type="button" name="createVariant" _click="\${this.createShowcase}">Create new showcase</button>
      <div id="showcases" data-sifrr-repeat="\${this.state.showcases}">
        <li class="font showcase small" data-showcase-id="\${this.state.key}" draggable="true">\${this.state.name}<span>X</span></li>
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
      if (el.matches('.showcase span')) this.deleteShowcase(this.getChildIndex(el.parentNode));
    });
    this.loadUrl();
    this.switchShowcase(0);
    if (window.Sortable) {
      const me = this;
      new window.Sortable(this.$('#showcases'), {
        draggable: 'li',
        onEnd: (e) => {
          const o = e.oldIndex, n = e.newIndex;
          const old = me.state.showcases[o];
          me.state.showcases[o] = me.state.showcases[n];
          me.state.showcases[n] = old;
          const current = me.$('#showcases .current');
          me.switchShowcase(me.getChildIndex(current));
        }
      });
    }
  }

  getChildIndex(el) {
    let i = 0;
    while((el = el.previousElementSibling) != null) i++;
    return i;
  }

  deleteShowcase(i) {
    this.state.showcases.splice(i, 1);
    if (i == this.state.current) this.switchShowcase(this.state.current);
    else this.switchShowcase(this.state.current - 1);
  }

  createShowcase() {
    this.state.showcases.splice(this.state.current + 1, 0, {
      name: this.$('#showcaseName').value,
      variants: [],
      element: this.$('#showcaseName').value
    });
    this.switchShowcase(this.state.current + 1);
  }

  switchShowcase(i) {
    this.current = i;
    this.$('#showcases').children[this.state.current].classList.remove('current');
    if (!this.state.showcases[i]) i = this.state.showcases.length - 1;
    this.state = { current: i };
    this.el._state = this.state.showcases[i];
    this.el.update();
    this.$('#showcases').children[i].id = 'showcase' + i;
    this.$('#showcases').children[i].classList.add('current');
  }

  onStateChange() {
    if (this.state.current !== this.current) this.switchShowcase(this.state.current);
  }

  saveShowcase() {
    this.state.showcases[this.state.current] = Object.assign(this.state.showcases[this.state.current] || {}, JSON.parse(JSON.stringify(this.el.state)));
    if (this._loaded) {
      this.$('#status').textContent = 'saving locally!';
      if (this._timeout) clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        this._timeout = null;
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
    window.fetch(this._url).then((resp) => resp.json()).then(v => {
      this.state.showcases = v.showcases;
      this.switchShowcase(v.current);
      this.$('#status').textContent = 'loaded from url!';
    }).catch((e) => {
      this.$('#status').textContent = e.message;
      storage.all().then(v => {
        this.$('#status').textContent = 'failed to load from url, loaded from storage!';
        this._loaded = true;
        if (Array.isArray(v.showcases)) {
          this.state.showcases = v.showcases;
          this.switchShowcase(v.current);
        }
      });
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
      this.switchShowcase(json.current);
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

SifrrDom.register(SifrrShowcase);

export default SifrrShowcase;
