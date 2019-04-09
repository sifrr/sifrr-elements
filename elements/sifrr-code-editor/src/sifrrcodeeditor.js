import SifrrDom from '@sifrr/dom';
import style from './style.scss';

const template = SifrrDom.template`
<style media="screen">
  ${style}
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/\${this.theme}.min.css">
<pre class='hljs'>
  <code id="highlight" data-sifrr-html="true">
    \${this.htmlValue}
  </code>
</pre>
<textarea class='hljs' _input="\${this.input}" _scroll="console.log(this)"></textarea>`;

SifrrDom.Event.add('scroll');
class SifrrCodeEditor extends SifrrDom.Element {
  static get template() {
    return template;
  }

  static observedAttrs() {
    return ['value', 'theme'];
  }

  onAttributeChange() {
    this.update();
  }

  onConnect() {
    fetch('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js')
      .then(resp => resp.text())
      .then(text => new Function(text)())
      .then(() => this.hljsLoaded());

    const txtarea = this.$('textarea');
    this.$('textarea').addEventListener('keydown', (e) => {
      let keyCode = e.keyCode || e.which;
      this.$('#highlight').style.height = this.$('textarea').height;
      if (keyCode == 9) {
        e.preventDefault();
        const start = txtarea.selectionStart;
        const end = txtarea.selectionEnd;

        const tabCharacter = '  ';
        const tabOffset = 2;

        // set textarea value to: text before caret + tab + text after caret
        txtarea.value = txtarea.value.substring(0, start) + tabCharacter + txtarea.value.substring(end);

        // put caret at right position again
        txtarea.selectionStart = txtarea.selectionEnd = start + tabOffset;
      }
    });
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
    if (window.hljs) return hljs.highlight(this.lang, this.value).value;
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

if (window) SifrrDom.register(SifrrCodeEditor);

export default SifrrCodeEditor;
