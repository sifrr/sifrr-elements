import SifrrDom from '@sifrr/dom';
import style from './style.scss';

const CM_VERSION = '5.49.2';

const template = SifrrDom.template`
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/theme/\${this.getTheme()}.css">
<style media="screen">
  ${style}
</style>
<textarea :value="\${this.value || ''}" _change="\${this.textAreaInput}"></textarea>`;

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

  onConnect() {
    this.constructor.cm().then(() => this.cmLoaded());
  }

  onPropsChange(props) {
    if (this._cmLoaded) {
      if (props.indexOf('theme') > -1) this.cm.setOption('theme', this.getTheme());
      if (props.indexOf('lang') > -1) this.cm.setOption('mode', this.getLang());
    }
    if (['value', 'theme', 'lang'].filter(p => props.indexOf(p) > -1).length > 0) this.update();
  }

  onUpdate() {
    if (this._cmLoaded && this.cm.getValue() !== this.value) return this.cm.setValue(this.value);
  }

  cmLoaded() {
    SifrrDom.Loader.executeJS(
      `https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/${this.getLang()}/${this.getLang()}.js`
    ).then(() => {
      this.cm = window.CodeMirror.fromTextArea(this.$('textarea'), {
        value: this.$('textarea').value,
        mode: this.getLang(),
        htmlMode: true,
        theme: this.getTheme(),
        indentUnit: 2,
        tabSize: 2,
        lineNumbers: true
      });
      this.cm.on('change', this.setValueFromCm.bind(this));
      this._cmLoaded = true;
    });
  }

  getTheme() {
    return this.theme ? this.theme.split(' ')[0] : 'dracula';
  }

  getLang() {
    return this.lang || 'xml';
  }

  textAreaInput() {
    this.value = this.$('textarea').value;
    this.triggerChange();
  }

  setValueFromCm() {
    this.value = this.cm.getValue();
    this.triggerChange();
  }

  triggerChange() {
    this.update();
    SifrrDom.Event.trigger(this, 'input');
    SifrrDom.Event.trigger(this, 'change');
  }
}

SifrrDom.register(SifrrCodeEditor);

export default SifrrCodeEditor;
