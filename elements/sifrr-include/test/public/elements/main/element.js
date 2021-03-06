class MainElement extends Sifrr.Dom.Element {
  static get useShadowRoot() {
    return false;
  }

  static get template() {
    return Sifrr.Template.html`<sifrr-include></sifrr-include>
  <sifrr-include id="html" :type=${() => 'html'} :url=${() => '/test.html'}></sifrr-include>
  <sifrr-include
    id="htmlSelector"
    :type=${() => 'html'}
    :url=${() => '/selector.html'}
    :selector=${() => '#selector'}
  ></sifrr-include>
  <sifrr-include id="css" :type=${() => 'css'} :url=${() => '/test.css'}></sifrr-include>
  <sifrr-include id="js" :type=${() => 'js'} :url=${() => '/test.js'}></sifrr-include>`;
  }
}
Sifrr.Dom.register(MainElement);
