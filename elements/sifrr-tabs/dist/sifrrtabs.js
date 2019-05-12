/*! SifrrTabs v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom'], factory) :
  (global = global || self, global.SifrrTabs = factory(global.Sifrr.Dom));
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

  var css = ":host {\n  /* CSS for tabs container */\n  line-height: 24px;\n  overflow: hidden;\n  width: 100%;\n  display: block;\n  position: relative; }\n\n.headings {\n  /* CSS for heading bar */\n  width: 100%;\n  overflow-y: hidden;\n  overflow-x: auto;\n  position: relative;\n  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2); }\n\n.headings ul {\n  padding: 0 0 3px;\n  margin: 0;\n  font-size: 0; }\n\n/* CSS for heading text li */\n.headings *::slotted(*) {\n  font-size: 16px;\n  display: inline-block;\n  text-align: center;\n  padding: 8px;\n  text-decoration: none;\n  list-style: none;\n  color: white;\n  border-bottom: 2px solid transparent;\n  opacity: 0.9;\n  cursor: pointer;\n  box-sizing: border-box; }\n\n.headings *::slotted(*.active) {\n  opacity: 1; }\n\n.headings *::slotted(*:hover) {\n  opacity: 1; }\n\n/* CSS for line under active tab heading */\n.headings .underline {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  height: 3px;\n  background: white; }\n\n/* Arrows css */\n.arrow {\n  position: absolute;\n  z-index: 5;\n  top: 0;\n  bottom: 0; }\n\n.arrow > * {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  margin: -6px 5px;\n  top: 50%;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px;\n  filter: drop-shadow(-1px -1px 3px #000); }\n\n.arrow.l {\n  left: 0;\n  cursor: w-resize; }\n\n.arrow.l > * {\n  left: 0;\n  transform: rotate(135deg); }\n\n.arrow.r {\n  right: 0;\n  cursor: e-resize; }\n\n.arrow.r > * {\n  right: 0;\n  transform: rotate(-45deg); }\n\n/* Tab container css */\n.content {\n  width: 100%;\n  height: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  margin: 0;\n  line-height: normal;\n  box-sizing: border-box; }\n\n.content .tabs {\n  min-height: 1px; }\n\n/* Tab element css */\n.content *::slotted([slot=\"tab\"]) {\n  float: left;\n  max-height: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  vertical-align: top;\n  padding: 8px;\n  box-sizing: border-box; }\n";

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var sifrr_animate = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
    module.exports = factory();
  }(commonjsGlobal, function () {  const beziers = {};
    class Bezier {
      constructor(args) {
        const key = args.join('_');
        if (!beziers[key]) {
          this.setProps(...args);
          beziers[key] = this.final.bind(this);
        }
        return beziers[key];
      }
      setProps(x1, y1, x2, y2) {
        let props = {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          A: (aA1, aA2) => 1.0 - 3.0 * aA2 + 3.0 * aA1,
          B: (aA1, aA2) => 3.0 * aA2 - 6.0 * aA1,
          C: aA1 => 3.0 * aA1,
          CalcBezier: (aT, aA1, aA2) => ((this.A(aA1, aA2) * aT + this.B(aA1, aA2)) * aT + this.C(aA1)) * aT,
          GetSlope: (aT, aA1, aA2) => 3.0 * this.A(aA1, aA2) * aT * aT + 2.0 * this.B(aA1, aA2) * aT + this.C(aA1)
        };
        Object.assign(this, props);
      }
      final(x) {
        if (this.x1 == this.y1 && this.x2 == this.y2) return x;
        return this.CalcBezier(this.GetTForX(x), this.y1, this.y2);
      }
      GetTForX(xx) {
        let t = xx;
        for (let i = 0; i < 4; ++i) {
          let slope = this.GetSlope(t, this.x1, this.x2);
          if (slope == 0) return t;
          let x = this.CalcBezier(t, this.x1, this.x2) - xx;
          t -= x / slope;
        }
        return t;
      }
    }
    var bezier = Bezier;
    var types = {
      linear: [0, 0, 1, 1],
      ease: [.25, .1, .25, 1],
      easeIn: [.42, 0, 1, 1],
      easeOut: [0, 0, .58, 1],
      easeInOut: [.42, 0, .58, 1]
    };
    const digitRgx = /(\d+)/;
    function animateOne({
      target,
      prop,
      from,
      to,
      time = 300,
      type = 'ease',
      onUpdate,
      round = false
    }) {
      const toSplit = to.toString().split(digitRgx),
            l = toSplit.length,
            raw = [],
            fromNums = [],
            diffs = [];
      const fromSplit = (from || target[prop] || '').toString().split(digitRgx);
      const onUp = typeof onUpdate === 'function';
      for (let i = 0; i < l; i++) {
        const n = Number(toSplit[i]);
        if (isNaN(n) || !toSplit[i]) raw.push(toSplit[i]);else {
          fromNums.push(Number(fromSplit[i]) || 0);
          diffs.push(n - (Number(fromSplit[i]) || 0));
        }
      }
      type = typeof type === 'function' ? type : new bezier(types[type] || type);
      return new Promise(res => {
        let startTime;
        function frame(currentTime) {
          startTime = startTime || currentTime;
          const percent = (currentTime - startTime) / time,
                bper = type(percent >= 1 ? 1 : percent);
          const next = diffs.map((d, i) => {
            if (round) return Math.round(bper * d + fromNums[i]);
            return bper * d + (fromNums[i] || 0);
          });
          const val = String.raw({
            raw
          }, ...next);
          target[prop] = Number(val) || val;
          if (onUp) onUpdate(target, prop, target[prop]);
          if (percent >= 1) return res();
          window.requestAnimationFrame(frame);
        }
        window.requestAnimationFrame(frame);
      });
    }
    var animateone = animateOne;
    function animate({
      targets,
      target,
      to,
      time,
      type,
      onUpdate,
      round
    }) {
      targets = targets ? Array.from(targets) : [target];
      function iterate(target, props) {
        const promises = [];
        for (let prop in props) {
          let from, final;
          if (Array.isArray(props[prop])) [from, final] = props[prop];else final = props[prop];
          if (typeof props[prop] === 'object' && !Array.isArray(props[prop])) {
            promises.push(iterate(target[prop], props[prop]));
          } else {
            promises.push(animateone({
              target,
              prop,
              to: final,
              time,
              type,
              from,
              onUpdate,
              round
            }));
          }
        }
        return Promise.all(promises);
      }
      return Promise.all(targets.map(target => iterate(target, to)));
    }
    animate.types = types;
    animate.wait = (t = 0) => new Promise(res => setTimeout(res, t));
    animate.animate = animate;
    var animate_1 = animate;
    return animate_1;
  }));
  });

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<style>\n  .tabs {\n    height: ${this.options ? this.options.tabHeight : 'auto'};\n    width: ${this.totalWidth + 'px'};\n  }\n  .headings {\n    display: ${this.headingDisplay};\n    background: ${this.options ? this.options.background : 'transparent'};\n  }\n  .content *::slotted([slot=\"tab\"]) {\n    width: ${this.tabWidth + 'px'};\n    margin: 0 ${this.options ? this.options.arrowMargin + 'px' : 0};\n  }\n  .arrow {\n    width: ${this.options ? this.options.arrowWidth : '20px'};\n  }\n</style>\n<div class=\"headings\">\n  <ul>\n    <slot name=\"heading\">\n    </slot>\n  </ul>\n  <div class=\"underline\"></div>\n</div>\n<div class=\"content\">\n  <div class=\"arrow l\" _click=${this.prev}>\n    <span></span>\n  </div>\n  <div class=\"arrow r\" _click=${this.next}>\n    <span></span>\n  </div>\n  <div class=\"tabs\">\n    <slot name=\"tab\">\n    </slot>\n  </div>\n</div>"], ["<style media=\"screen\">\n  ", "\n</style>\n<style>\n  .tabs {\n    height: \\${this.options ? this.options.tabHeight : 'auto'};\n    width: \\${this.totalWidth + 'px'};\n  }\n  .headings {\n    display: \\${this.headingDisplay};\n    background: \\${this.options ? this.options.background : 'transparent'};\n  }\n  .content *::slotted([slot=\"tab\"]) {\n    width: \\${this.tabWidth + 'px'};\n    margin: 0 \\${this.options ? this.options.arrowMargin + 'px' : 0};\n  }\n  .arrow {\n    width: \\${this.options ? this.options.arrowWidth : '20px'};\n  }\n</style>\n<div class=\"headings\">\n  <ul>\n    <slot name=\"heading\">\n    </slot>\n  </ul>\n  <div class=\"underline\"></div>\n</div>\n<div class=\"content\">\n  <div class=\"arrow l\" _click=\\${this.prev}>\n    <span></span>\n  </div>\n  <div class=\"arrow r\" _click=\\${this.next}>\n    <span></span>\n  </div>\n  <div class=\"tabs\">\n    <slot name=\"tab\">\n    </slot>\n  </div>\n</div>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const template = SifrrDom.template(_templateObject(), css);
  function removeExceptOne(elements, name, index) {
    if (elements instanceof HTMLElement) elements = elements.children;
    for (let j = 0; j < elements.length; j++) {
      j !== index && elements[j] !== index ? elements[j].classList.remove(name) : elements[j].classList.add(name);
    }
  }
  class SifrrTabs extends SifrrDom.Element {
    static get template() {
      return template;
    }
    static observedAttrs() {
      return ['options'];
    }
    onConnect() {
      this._connected = true;
      this.refresh();
      this.setWindowResizeEvent();
      this.setSlotChangeEvent();
      this.setScrollEvent();
    }
    onAttributeChange(n, _, v) {
      if (n === 'options') {
        this._attrOptions = JSON.parse(v || '{}');
        if (this._connected) this.refresh();
      }
    }
    refresh() {
      this.options = Object.assign({
        menu: this.$('.headings ul'),
        content: this.$('.content'),
        tabcontainer: this.$('.tabs'),
        menus: this.$('slot[name=heading]').assignedNodes(),
        tabs: this.$('slot[name=tab]').assignedNodes(),
        la: this.$('.arrow.l'),
        ra: this.$('.arrow.r'),
        line: this.$('.underline'),
        num: 1,
        showArrows: false,
        arrowMargin: 0,
        arrowWidth: '20px',
        showMenu: true,
        step: 1,
        tabHeight: 'auto',
        showUnderline: true,
        loop: false,
        animation: 'ease',
        animationTime: 300,
        scrollBreakpoint: 0.2,
        background: '#714cfe'
      }, this._attrOptions);
      if (!this.options.tabs || this.options.tabs.length < 1) return;
      this.usableWidth = this.clientWidth;
      this.totalWidth = this.usableWidth / this.options.num * this.options.tabs.length;
      this.usableWidth -= 2 * this.options.arrowMargin;
      this.tabWidth = this.usableWidth / this.options.num;
      this.setProps();
      this.update();
      this.active = this.active || 0;
    }
    setProps() {
      if (!this.options.showArrows) {
        this.options.la.style.display = 'none';
        this.options.ra.style.display = 'none';
      } else {
        this.options.la.style.display = 'block';
        this.options.ra.style.display = 'block';
        Array.from(this.options.tabs).forEach(e => e.style.margin = "0 ".concat(this.margin, "px"));
      }
      if (!this.options.showUnderline) this.options.line.style.display = 'none';
      if (this.options.showMenu) {
        this.headingDisplay = 'block';
        this.options.line.style.width = this.options.menus[0].offsetWidth + 'px';
        this.setMenuProps();
      } else this.headingDisplay = 'none';
    }
    setMenuProps() {
      let left = 0;
      this.options.menuProps = [];
      Array.from(this.options.menus).forEach((elem, i) => {
        this.options.menuProps[i] = {
          width: elem.offsetWidth,
          left: left
        };
        left += elem.offsetWidth;
        elem._click = () => this.active = i;
      });
      const last = this.options.menuProps[this.options.menus.length - 1];
      this.options.menu.style.width = last.left + last.width + 5 * this.options.menus.length + 'px';
      const active = this.options.menuProps[this.active];
      this.options.line.style.left = active.left + 'px';
      this.options.line.style.width = active.width + 'px';
    }
    setScrollEvent() {
      let me = this,
          isScrolling,
          scrollPos;
      this.options.content.onscroll = () => requestAnimationFrame(onScroll);
      function onScroll() {
        scrollPos = me.active;
        const total = me.options.content.scrollLeft / me.tabWidth;
        const per = total % 1;
        const t = Math.floor(total);
        if (me.options.showMenu) {
          const left = me.options.menuProps[t].left * (1 - per) + (me.options.menuProps[t + 1] || {
            left: 0
          }).left * per;
          const width = me.options.menuProps[t].width * (1 - per) + (me.options.menuProps[t + 1] || {
            width: 0
          }).width * per;
          me.options.line.style.left = left + 'px';
          me.options.line.style.width = width + 'px';
          me.options.menu.parentElement.scrollLeft = left + (width - me.tabWidth) / 2;
        }
        clearTimeout(isScrolling);
        isScrolling = setTimeout(function () {
          if (total - scrollPos < -me.options.scrollBreakpoint) {
            me.active = t;
          } else if (total - scrollPos > +me.options.scrollBreakpoint) {
            me.active = t + 1;
          } else {
            me.active = scrollPos;
          }
        }, 66);
      }
    }
    setWindowResizeEvent() {
      window.addEventListener('resize', () => requestAnimationFrame(this.refresh.bind(this)));
    }
    setSlotChangeEvent() {
      const me = this;
      const fxn = () => {
        me.options.menus = me.$$('slot')[0].assignedNodes();
        me.options.tabs = me.$$('slot')[1].assignedNodes();
        me.refresh();
      };
      this.$$('slot')[0].addEventListener('slotchange', fxn);
      this.$$('slot')[1].addEventListener('slotchange', fxn);
    }
    get active() {
      return this.state ? this.state.active : 0;
    }
    set active(i) {
      this.state = {
        active: i
      };
    }
    beforeUpdate() {
      if (!this.options) return;
      let i = this.state.active;
      i = this.getTabNumber(i);
      if (!isNaN(i) && i !== this.state.active) return this.active = i;
      sifrr_animate({
        target: this.options.content,
        to: {
          scrollLeft: i * (this.tabWidth + 2 * this.options.arrowMargin)
        },
        time: this.options.animationTime,
        type: this.options.animation === 'none' ? () => 1 : this.options.animation
      });
      removeExceptOne(this.options.tabs, 'active', i);
      removeExceptOne(this.options.tabs, 'prev', this.getTabNumber(i - 1));
      removeExceptOne(this.options.tabs, 'next', this.getTabNumber(i + 1));
      removeExceptOne(this.options.menus, 'active', i);
      removeExceptOne(this.options.menus, 'prev', this.getTabNumber(i - 1));
      removeExceptOne(this.options.menus, 'next', this.getTabNumber(i + 1));
      if (this.options.showArrows) {
        this.options.la.style.display = this.hasPrev() || this.options.loop ? 'block' : 'none';
        this.options.ra.style.display = this.hasNext() || this.options.loop ? 'block' : 'none';
      }
    }
    next() {
      this.active = this.state.active + this.options.step;
    }
    hasNext() {
      if (this.active === this.options.tabs.length - this.options.num) return false;
      return true;
    }
    prev() {
      this.active = this.state.active - this.options.step;
    }
    hasPrev() {
      if (this.active === 0) return false;
      return true;
    }
    getTabNumber(i) {
      const l = this.options.tabs.length;
      const num = this.options.num;
      i = i < 0 ? i + l : i % l;
      if (i + num - 1 >= l) {
        i = this.options.loop ? 0 : l - num;
      }
      return i;
    }
  }
  SifrrTabs.defaultState = {
    active: 0
  };
  SifrrDom.register(SifrrTabs);

  return SifrrTabs;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrtabs.js.map
