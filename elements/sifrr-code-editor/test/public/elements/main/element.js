const a = { value: '' };

class MainElement extends Sifrr.Dom.Element {
  static get template() {
    return Sifrr.Template.html`
      <sifrr-code-editor :value=${() => a.value} :oninput=${Sifrr.Template.memo(el => e => {
      a.value = e.target.value;
      el.update();
    })}></sifrr-code-editor>
      <sifrr-code-editor :value=${() => 'bang'}></sifrr-code-editor>
  <sifrr-code-editor :lang=${() => 'javascript'}></sifrr-code-editor>
  <sifrr-code-editor :lang=${() => 'css'}></sifrr-code-editor>`;
  }
  static get useShadowRoot() {
    return false;
  }
}
Sifrr.Dom.register(MainElement, {
  dependsOn: ['sifrr-code-editor']
});
