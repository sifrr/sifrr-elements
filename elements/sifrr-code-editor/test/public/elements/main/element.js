const a = { value: '' };

Sifrr.Dom.Event.add('input');
class MainElement extends Sifrr.Dom.Element {
  static get template() {
    return Sifrr.Template.html`
      <sifrr-code-editor :value=${() => a.value} :_input=${Sifrr.Template.memo(
      el => (e, target) => {
        a.value = target.value;
        el.update();
      }
    )}></sifrr-code-editor>
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
