import SifrrDom from '@sifrr/dom';
import style from './style.scss';

const CM_VERSION = '5.49.2';

const template = SifrrDom.template`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/theme/\${this.getTheme()}.css">
<style media="screen">
  ${style}
</style>
<textarea value="\${this.value}" _input="\${this.input}"></textarea>`;

class SifrrCodeEditor extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static cm() {
    this._cm =
      this._cm ||
      SifrrDom.Loader.executeJS(
        `https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.js`
      );
    return this._cm;
  }

  onPropsChange(props) {
    if (this._cmLoaded) {
      if (props.indexOf('theme') > -1) this.cm.setOption('theme', this.getTheme());
      if (props.indexOf('lang') > -1) this.cm.setOption('mode', this.lang || 'xml');
    }
    if (['value', 'theme', 'lang'].filter(p => props.indexOf(p) > -1).length > 0) this.update();
  }

  onConnect() {
    this.constructor.cm().then(() => this.cmLoaded());
  }

  input() {
    SifrrDom.Event.trigger(this, 'input');
    this.value = this.getValue();
    this.update();
  }

  cmLoaded() {
    this.lang = this.lang || 'xml';
    SifrrDom.Loader.executeJS(
      `https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/${this.lang}/${this.lang}.js`
    ).then(() => {
      this.cm = window.CodeMirror.fromTextArea(this.$('textarea'), {
        value: this.$('textarea').value,
        mode: this.lang,
        htmlMode: true,
        theme: this.getTheme(),
        indentUnit: 2,
        tabSize: 2,
        lineNumbers: true
      });
      this.cm.on('change', this.input.bind(this));
      this._cmLoaded = true;
    });
  }

  getTheme() {
    return this.theme ? this.theme.split(' ')[0] : 'dracula';
  }

  getValue() {
    if (this._cmLoaded) return this.cm.getValue();
    else return this.$('textarea').value;
  }

  set value(v) {
    if (v === this.value) return;
    if (this._cmLoaded) return this.cm.setValue(v);
    else this.$('textarea').value = v;
  }
}

SifrrDom.register(SifrrCodeEditor);

export default SifrrCodeEditor;
