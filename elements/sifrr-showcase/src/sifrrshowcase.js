import SifrrDom, { bindStoresToElement } from '@sifrr/dom';

import { showcaseStore } from './stores';

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
      <button type="button" name="loadUrl" _click=\${(this.loadUrl)}>Load from url</button>
      <p class="font" id="status"></p>
      <span class="button font">
        Upload File
        <input type="file" name="file" accept="application/json" _input="\${this.loadFile}" />
      </span>
      <button class="font" type="button" name="saveFile" _click="\${this.saveFile}">Save to File</button>
      <h3 class="font head">Showcases</h3>
      <input style="width: 100%" id="showcaseName" type="text" name="showcase" _input="\${(v) => this.store.setActiveValue({ name: v })}" value="\${this.store.getActiveValue().name}">
      <button style="width: 100%" class="font" type="button" name="createVariant" _click="\${this.createShowcase}">Create new showcase</button>
      <div id="showcases" :sifrr-repeat="\${this.store.getValues()}">
        <li class="font showcase small \${this.state.active ? 'current' : ''}" draggable="true">\${this.state.name}<span>X</span></li>
      </div>
    </div>
  </div>
  <sifrr-single-showcase></sifrr-single-showcase>
</div>`;

class SifrrShowcase extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['url'];
  }

  constructor() {
    super();
    bindStoresToElement(this, [showcaseStore]);
    this.store = showcaseStore;
    this.store.onStatus = this.onStatus.bind(this);
  }

  onAttributeChange(n, _, value) {
    if (n === 'url') this.loadUrl(value);
  }

  loadUrl(value) {
    this.store.fetchStore(value);
  }

  onConnect() {
    SifrrDom.Event.addListener('click', '.showcase', (e, el) => {
      if (el.matches('.showcase')) this.store.setActive(this.getChildIndex(el));
      if (el.matches('.showcase span')) this.store.delete(this.getChildIndex(el.parentNode));
    });
    if (window.Sortable) {
      const me = this;
      new window.Sortable(this.$('#showcases'), {
        draggable: 'li',
        onEnd: e => {
          const o = e.oldIndex,
            n = e.newIndex;
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
    while ((el = el.previousElementSibling) != null) i++;
    return i;
  }

  createShowcase() {
    this.store.add({
      name: this.$('#showcaseName').value,
      variants: [],
      element: this.$('#showcaseName').value
    });
  }

  onStateChange() {
    this.$('#showcases').children[this.store.value.active].classList.add('current');
  }

  onStatus(v) {
    this.$('#status').textContent = v;
  }

  get el() {
    return this.$('sifrr-single-showcase');
  }

  saveFile() {
    const blob = new Blob([JSON.stringify(this.store.value, null, 2)], {
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
      this.store.setValues(JSON.parse(fr.result).showcases);
      this.store.setActive(JSON.parse(fr.result).active || 0);
      this.onStatus('loaded from file!');
    };
    fr.readAsText(file);
  }
}

SifrrShowcase.defaultState = {
  current: -1,
  showcases: []
};

SifrrDom.register(SifrrShowcase);

export default SifrrShowcase;
