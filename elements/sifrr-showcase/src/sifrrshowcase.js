import { html, memo } from '@sifrr/template';
import { Element, register, Event } from '@sifrr/dom';

import { showcaseStore } from './stores';

import './singleshowcase';
import { Li } from './template.js';
import style from './style.scss';

const template = html`
  <style media="screen">
    ${style}
  </style>
  <div class="container">
    <div class="flex-column" id="sidemenu">
      <div class="box">
        <h1 class="font head">Sifrr Showcase</h1>
        <p class="font" id="loader"></p>
        <input id="url" type="text" placeholder="Enter url here..." name="url" />
        <button type="button" name="loadUrl" :_click="${memo(el => el.loadUrl.bind(el))}">
          Load from url
        </button>
        <p class="font" id="status"></p>
        <span class="button font">
          Upload File
          <input
            type="file"
            name="file"
            accept="application/json"
            :_input="${memo(el => el.loadFile.bind(el))}"
          />
        </span>
        <button
          class="font"
          type="button"
          name="saveFile"
          :_click="${memo(el => el.saveFile.bind(el))}"
        >
          Save to File
        </button>
        <h3 class="font head">Showcases</h3>
        <input
          style="width: 100%"
          id="showcaseName"
          type="text"
          name="showcase"
          :_input="${memo(el => el.store.bindUpdate('name'))}"
          :value="${el => el.store.getActiveValue().name || ''}"
        />
        <button
          style="width: 100%"
          class="font"
          type="button"
          name="createVariant"
          :_click="${memo(el => el.createShowcase.bind(el))}"
        >
          Create new showcase
        </button>
        <div id="showcases">
          ${(el, oldValue) => el.store.getValues().map((v, i) => Li(v, oldValue[i]))}
        </div>
      </div>
    </div>
    <sifrr-single-showcase></sifrr-single-showcase>
  </div>
`;

class SifrrShowcase extends Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['url'];
  }

  constructor() {
    super();
    this.state = {
      current: -1,
      showcases: []
    };
    showcaseStore.addListener(() => this.update());
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
    Event.addListener('click', '#showcases', (e, el) => {
      if (el.matches('li')) this.store.setActive(this.getChildIndex(el));
      if (el.matches('li span')) this.store.delete(this.getChildIndex(el.parentNode));
    });
    this.store.fetchStore(this.url, this.onStatus.bind(this));
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
      this.store.setValues(JSON.parse(fr.result).values);
      this.store.setActive(JSON.parse(fr.result).active || 0);
      this.onStatus('loaded from file!');
    };
    fr.readAsText(file);
  }
}

register(SifrrShowcase);

export default SifrrShowcase;
