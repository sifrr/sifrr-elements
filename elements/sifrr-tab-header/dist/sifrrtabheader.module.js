/*! SifrrTabHeader v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';

var css = ":host {\n  box-sizing: border-box;\n  width: 100%;\n  display: block;\n  position: relative;\n  overflow-x: auto;\n  margin: 0; }\n\n.tabs {\n  min-height: 1px;\n  display: block; }\n\n.tabs::slotted(*) {\n  float: left;\n  max-height: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  vertical-align: top;\n  padding: 8px;\n  box-sizing: border-box; }\n";

const template = SifrrDom.template`<style media="screen">
  ${css}
</style>
<style media="screen">
  .tabs {
    width: \${this.totalWidth + 'px'};
  }
  .tabs::slotted(*) {
    width: \${this.tabWidth + 'px'};
  }
</style>`;
class SifrrTabHeader extends SifrrDom.Element {
  static get template() {
    return template;
  }
}
SifrrDom.register(SifrrTabHeader);

export default SifrrTabHeader;
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrtabheader.module.js.map
