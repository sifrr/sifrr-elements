class MainElement extends Sifrr.Dom.Element {
  static get template() {
    return Sifrr.Template.html`
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
