import { html, memo } from '@sifrr/template';
import { Element, register, Event, Loader } from '@sifrr/dom';
import style from './style.scss';

const CM_VERSION = '5.49.2';

const template = html`
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.css"
  />
  <link
    rel="stylesheet"
    href="${el =>
      `https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/theme/${el.getTheme()}.css`}"
  />
  <style media="screen">
    ${style}
  </style>
  <textarea :value=${el => el.value || ''} :_input=${memo(el => el.textAreaInput)}></textarea>
`;

class SifrrCodeEditor extends Element {
  static get template() {
    return template;
  }

  static cm() {
    this._cm =
      this._cm ||
      Loader.executeJS(`https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.js`);
    return this._cm;
  }

  onConnect() {
    this.constructor.cm().then(() => this.cmLoaded());
  }

  onPropChange(prop) {
    if (this._cmLoaded) {
      if (prop === 'theme') this.cm.setOption('theme', this.getTheme());
      if (prop === 'lang') this.cm.setOption('mode', this.getLang());
    }
  }

  onUpdate() {
    if (this._cmLoaded && this.cm.getValue() !== this.value) {
      this.cm.setValue(this.value);
    }
  }

  cmLoaded() {
    this.loading =
      this.loading ||
      this.constructor.cm().then(() =>
        Loader.executeJS(
          `https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/${this.getLang()}/${this.getLang()}.js`
        ).then(() => {
          this.cm = window.CodeMirror.fromTextArea(this.$('textarea'), {
            value: this.$('textarea').value,
            mode: this.getLang(),
            htmlMode: true,
            theme: this.getTheme(),
            indentUnit: 2,
            tabSize: 2,
            matchBrackets: true,
            lineNumbers: true,
            onCursorActivity: () => {
              this.setValueFromCm();
            }
          });
          this._cmLoaded = true;
        })
      );

    return this.loading;
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
    Event.trigger(this, 'input');
    Event.trigger(this, 'change');
  }
}

register(SifrrCodeEditor);

export default SifrrCodeEditor;
