/*! SifrrTabHeader v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom'], factory) :
  (global = global || self, global.SifrrTabHeader = factory(global.Sifrr.Dom));
}(this, function (SifrrDom) { 'use strict';

  SifrrDom = SifrrDom && SifrrDom.hasOwnProperty('default') ? SifrrDom['default'] : SifrrDom;

  function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
      raw = strings.slice(0);
    }

    return Object.freeze(Object.defineProperties(strings, {
      raw: {
        value: Object.freeze(raw)
      }
    }));
  }

  var css = ":host {\n  /* CSS for tabs container */\n  display: block;\n  width: 100%;\n  position: relative;\n  overflow-x: auto;\n  box-sizing: border-box; }\n\nslot {\n  display: block;\n  min-width: 100%; }\n\nslot::slotted(*) {\n  float: left;\n  text-align: center;\n  vertical-align: middle;\n  opacity: 0.7;\n  cursor: pointer; }\n\nslot::slotted(*.active) {\n  opacity: 1; }\n\nslot::slotted(*:hover) {\n  opacity: 0.9; }\n\n/* CSS for line under active tab heading */\n.underline {\n  position: absolute;\n  bottom: 0;\n  height: 3px;\n  background: white; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n  slot::slotted(*) {\n    ${this.options ? this.options.style : ''}\n  }\n  :host {\n    padding-bottom: ${this.options && this.options.showUnderline ? '3px' : '0'};\n  }\n</style>\n<slot>\n</slot>\n<div class=\"underline\"></div>"], ["<style media=\"screen\">\n  ", "\n  slot::slotted(*) {\n    \\${this.options ? this.options.style : ''}\n  }\n  :host {\n    padding-bottom: \\${this.options && this.options.showUnderline ? '3px' : '0'};\n  }\n</style>\n<slot>\n</slot>\n<div class=\"underline\"></div>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const template = SifrrDom.template(_templateObject(), css);
  class SifrrTabHeader extends SifrrDom.Element {
    static get template() {
      return template;
    }
    static observedAttrs() {
      return ['options'];
    }
    onConnect() {
      this._connected = true;
      this.$('slot').addEventListener('slotchange', this.refresh.bind(this, {}));
      this.refresh();
    }
    onAttributeChange(n, _, v) {
      if (n === 'options') {
        this._attrOptions = JSON.parse(v || '{}');
        if (this._connected) this.refresh();
      }
    }
    refresh(options) {
      this._options = Object.assign({
        content: this,
        slot: this.$('slot'),
        showUnderline: true,
        line: this.$('.underline'),
        container: null
      }, this._options, options);
      this.options = Object.assign({}, this._options, this._attrOptions);
      this.options.menus = this.options.slot.assignedNodes().filter(n => n.nodeType === 1);
      if (!this.options.menus || this.options.menus.length < 1) return;
      this.setProps();
      this.active = this.active || 0;
    }
    setProps() {
      if (!this.options.showUnderline) this.options.line.style.display = 'none';
      this.setMenuProps();
      if (this.options.container) {
        const c = this.options.container;
        c.onScrollPercent = this.setScrollPercent.bind(this);
        SifrrDom.Event.addListener('update', c, () => this.active = c.active);
      }
      this.setScrollPercent(0);
    }
    setMenuProps() {
      let left = 0;
      this.options.menuProps = [];
      Array.from(this.options.menus).forEach((elem, i) => {
        const width = elem.getBoundingClientRect().width;
        this.options.menuProps[i] = {
          width,
          left: left
        };
        left += width;
        elem._click = () => {
          if (this.options.container) this.options.container.active = i;else this.active = i;
        };
      });
      const last = this.options.menuProps[this.options.menus.length - 1];
      this.options.totalMenuWidth = last.left + last.width;
      this.$('slot').style.width = this.options.slot.style.width = this.options.totalMenuWidth + 1 + 'px';
    }
    setScrollPercent(total) {
      const per = total % 1,
            t = Math.floor(total);
      const left = this.options.menuProps[t].left * (1 - per) + (this.options.menuProps[t + 1] || {
        left: 0
      }).left * per;
      const width = this.options.menuProps[t].width * (1 - per) + (this.options.menuProps[t + 1] || {
        width: 0
      }).width * per;
      this.options.line.style.left = left + 'px';
      this.options.line.style.width = width + 'px';
      this.scrollLeft = left + (width - this.clientWidth) / 2;
      if (per === 0) {
        this._active = t;
        this.update();
      }
    }
    get active() {
      return this._active || 0;
    }
    set active(i) {
      this._active = i;
      this.setScrollPercent(i);
      this.update();
    }
    onUpdate() {
      if (!this.options) return;
      for (let j = 0, l = this.options.menus.length; j < l; j++) {
        this.options.menus[j].classList[j === this.active ? 'add' : 'remove']('active');
      }
    }
  }
  SifrrDom.register(SifrrTabHeader);

  return SifrrTabHeader;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrtabheader.js.map
