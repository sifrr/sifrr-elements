/*! SifrrShowcase v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';
import SifrrStorage from '@sifrr/storage';

var css = "* {\n  box-sizing: border-box; }\n\n.font {\n  font-family: Roboto, Ariel; }\n\n.container {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-wrap: nowrap;\n  background-color: #3a3f5a; }\n\n#sidemenu {\n  width: 15%;\n  height: 100%; }\n\n#sidemenu > * {\n  height: 100%; }\n\nsifrr-single-showcase {\n  width: 85%;\n  height: 100%;\n  display: block; }\n\n#sidebar {\n  width: 30%;\n  height: 100%; }\n\n#sidebar > * {\n  height: 33.33%; }\n\n#main {\n  width: 70%;\n  height: 100%; }\n\n.current {\n  background: #5f616d; }\n\n.flex-column {\n  height: 100%;\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: column; }\n\n.box {\n  width: 100%;\n  overflow: scroll;\n  border: 1px solid #5f616d; }\n\n#element {\n  padding: 20px;\n  height: 70%; }\n\n#code {\n  height: 30%; }\n\n#code sifrr-code-editor {\n  height: calc(100% - 48px) !important; }\n\n.head {\n  color: #cccccc;\n  text-align: center; }\n\n.small {\n  color: #8f9cb3;\n  font-size: 16px;\n  line-height: 24px;\n  padding: 4px; }\n\n#error, #status {\n  color: red; }\n\nsifrr-code-editor {\n  height: calc(100% - 24px); }\n\nul {\n  padding: 8px;\n  margin: 0; }\n\n.variant, .showcase {\n  list-style-type: none; }\n  .variant span, .showcase span {\n    color: red;\n    float: right; }\n\n#saver, #loader {\n  color: green;\n  padding: 4px;\n  margin: 0; }\n\nbutton, .button {\n  position: relative;\n  display: inline-block;\n  background: #cccccc;\n  border: 1px solid grey;\n  color: #3a3f5a;\n  font-size: 14px;\n  padding: 4px; }\n  button input, .button input {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    opacity: 0; }\n";

const html = "<div class=\"container\">\n  <div class=\"flex-column\" id=\"sidebar\">\n    <div class=\"box\">\n      <h3 class=\"font head\">Variants</h3>\n      <input id=\"variantName\" type=\"text\" name=\"variantName\" value=\"${this.state.variantName}\" data-sifrr-bind=\"variantName\">\n      <button class=\"font\" type=\"button\" name=\"createVariant\" _click=\"${this.createNewVariant}\">Create new variant</button>\n      <style media=\"screen\">\n        #variant${this.state.variantId} {\n          background: #5f616d;\n        }\n      </style>\n      <div id=\"showcases\">\n        <div data-sifrr-repeat=\"${this.state.variants}\">\n          <li class=\"font variant small\" data-variant-id=\"${this.state.variantId}\" id=\"variant${this.state.variantId}\">${this.state.variantName}<span>X</span></li>\n        </div>\n      </div>\n    </div>\n    <div class=\"box\">\n      <label class=\"font small\" for=\"style\">Element CSS Styles</label>\n      <sifrr-code-editor lang=\"css\" data-sifrr-bind=\"style\" value=\"${this.state.style}\"></sifrr-code-editor>\n    </div>\n    <div class=\"box\">\n      <label class=\"font small\" for=\"elState\">Element State Function</label>\n      <sifrr-code-editor id=\"elState\" lang=\"js\" data-sifrr-bind=\"elState\" value=\"${this.state.elState}\"></sifrr-code-editor>\n    </div>\n  </div>\n  <div class=\"flex-column\" id=\"main\">\n    <div class=\"box\" id=\"element\" data-sifrr-html=\"true\">\n      ${this.state.code}\n    </div>\n    <div class=\"box\" id=\"code\">\n      <label class=\"font small\" for=\"elementName\">Element Name</label>\n      <input type=\"text\" name=\"elementName\" placeholder=\"Enter element name here...\" _input=\"${this.updateHtml}\" value=\"${this.state.element}\">\n      <label class=\"font small\" for=\"customUrl\">Custom Url</label>\n      <input type=\"text\" name=\"customUrl\" placeholder=\"Enter element url here...\" value=\"${this.state.elementUrl}\" data-sifrr-bind=\"elementUrl\">\n      <label class=\"font small\" for=\"elementName\">Is JS File</label>\n      <select id=\"isjs\" name=\"isjs\" value=\"${this.state.isjs}\" data-sifrr-bind=\"isjs\">\n        <option value=\"true\">true</option>\n        <option value=\"false\">false</option>\n      </select>\n      <span class=\"font\" id=\"error\"></span>\n      <br>\n      <label class=\"font small\" for=\"htmlcode\">HTML Code</label>\n      <sifrr-code-editor lang=\"html\" data-sifrr-bind=\"code\" value=\"${this.state.code}\"></sifrr-code-editor>\n    </div>\n  </div>\n</div>";

var css$1 = ":host {\n  display: block;\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\n.hljs {\n  width: 100%;\n  height: 100%;\n  font-family: Consolas,Liberation Mono,Courier,monospace;\n  font-size: 14px;\n  line-height: 18px;\n  padding: 8px;\n  margin: 0;\n  position: absolute;\n  white-space: pre-wrap;\n  top: 0;\n  left: 0; }\n\ntextarea {\n  z-index: 2;\n  resize: none;\n  border: none; }\n\ntextarea.loaded {\n  background: transparent !important;\n  text-shadow: 0px 0px 0px rgba(0, 0, 0, 0);\n  text-fill-color: transparent;\n  -webkit-text-fill-color: transparent; }\n\npre {\n  z-index: 1; }\n";

const template = SifrrDom.template`
<style media="screen">
  ${css$1}
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/\${this.theme}.min.css">
<pre class='hljs'>
  <code id="highlight" data-sifrr-html="true">
    \${this.htmlValue}
  </code>
</pre>
<textarea class='hljs' _input="\${this.input}"></textarea>`;
class SifrrCodeEditor extends SifrrDom.Element {
  static get template() {
    return template;
  }
  static observedAttrs() {
    return ['value', 'theme'];
  }
  static hljs() {
    this._hljs = this._hljs || fetch('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js')
      .then(resp => resp.text())
      .then(text => new Function(text)());
    return this._hljs;
  }
  onAttributeChange() {
    this.update();
  }
  onConnect() {
    this.constructor.hljs().then(() => this.hljsLoaded());
    const txtarea = this.$('textarea');
    txtarea.addEventListener('keydown', (e) => {
      let keyCode = e.keyCode || e.which;
      this.$('#highlight').style.height = this.$('textarea').height;
      if (keyCode == 9) {
        e.preventDefault();
        const start = txtarea.selectionStart;
        const end = txtarea.selectionEnd;
        const tabCharacter = '  ';
        const tabOffset = 2;
        txtarea.value = txtarea.value.substring(0, start) + tabCharacter + txtarea.value.substring(end);
        txtarea.selectionStart = txtarea.selectionEnd = start + tabOffset;
      }
    });
    txtarea.onscroll = () => {
      this.$('pre.hljs').scrollTop = txtarea.scrollTop;
    };
  }
  input() {
    SifrrDom.Event.trigger(this, 'input');
    this.update();
  }
  hljsLoaded() {
    this.$('textarea').classList.add('loaded');
    this.update();
  }
  get htmlValue() {
    if (window.hljs) return window.hljs.highlight(this.lang, this.value).value;
    else return this.value.replace(/</g, '&lt;');
  }
  get theme() {
    return this.getAttribute('theme') || 'atom-one-dark';
  }
  set theme(v) {
    this.setAttribute('theme', v);
    this.update();
  }
  get value() {
    return this.$('textarea').value;
  }
  set value(v) {
    this.$('textarea').value = v;
    this.update();
  }
  get lang() {
    return this.getAttribute('lang') || 'html';
  }
}
SifrrDom.register(SifrrCodeEditor);

const template$1 = SifrrDom.template`<style media="screen">
  ${css}
</style>
<style>
\${this.state.style}
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
    return template$1;
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
    if (!this.state.elemnt) return;
    if (this._element !== this.state.element || this._js !== this.state.isjs || this._url !== this.state.elementUrl) {
      SifrrDom.load(this.state.element, {
        js: this.state.isjs == 'true',
        url: this.state.elementUrl ? this.state.elementUrl : undefined
      }).then(() => this.$('#error').innerText = '').catch(e => this.$('#error').innerText = e.message);
      this._js = this.state.isjs;
      this._element = this.state.element;
      this._url = this.state.elementUrl;
    }
  }
  onUpdate() {
    let state;
    try {
      state = new Function(this.$('#elState').value).call(this.element());
    } catch (e) {    }
    if (state && this.element() && this.element().isSifrr && this.element().state !== state) {
      this.element().state = state;
    }
  }
  onAttributeChange(name, _, value) {
    if (name === 'url') this.url = value;
  }
  createNewVariant() {
    const id = Math.max(...this.state.variants.map(s => s.variantId), 0) + 1;
    const cid = this.state.variants.findIndex(v => v.variantId == this.state.variantId) + 1 || 1;
    this.state.variants.splice(cid, 0, Object.assign({}, {
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
    if (!this.state.variants) this.state.variants = [];
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
  updateHtml(e, el) {
    const html = `<${el.value}></${el.value}>`;
    this.state = { code: html, element: el.value };
  }
  element() {
    return this.$('#element').firstElementChild;
  }
  variant(id) {
    return this.state.variants.find(s => s.variantId == id) || this.state.variants[this.state.variants.length - 1];
  }
}
SifrrSingleShowcase.defaultState = defaultShowcase;
SifrrDom.register(SifrrSingleShowcase);

const template$2 = SifrrDom.template`<style media="screen">
  ${css}
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
    return template$2;
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
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrshowcase.module.js.map
