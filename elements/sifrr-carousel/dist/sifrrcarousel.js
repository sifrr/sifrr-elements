/*! SifrrCarousel v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom'], factory) :
  (global = global || self, global.SifrrCarousel = factory(global.Sifrr.Dom));
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

  var css = ":host {\n  display: block;\n  width: 100%; }\n\n#preview, #content {\n  position: relative; }\n\n#preview {\n  padding: 0 24px; }\n\n/* count, fs, and bg */\n#count {\n  position: absolute; }\n\n#count {\n  bottom: 6px;\n  right: 6px;\n  background: rgba(255, 255, 255, 0.7);\n  border-radius: 10px;\n  font-size: 14px;\n  padding: 4px 6px; }\n\n#bg {\n  background: rgba(255, 255, 255, 0.9);\n  display: none;\n  height: 100%;\n  width: 100%; }\n  #bg #cross {\n    position: absolute;\n    top: 6px;\n    right: 6px;\n    width: 32px;\n    height: 32px;\n    font-family: 'Helvetica', 'Arial', sans-serif;\n    font-size: 32px; }\n\n/* Arrows css */\n.arrow {\n  position: absolute;\n  z-index: 5;\n  top: 0;\n  bottom: 0; }\n\n.arrow > * {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  margin: -6px 5px;\n  top: 50%;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px; }\n\n.arrow.l {\n  left: 0;\n  cursor: w-resize; }\n\n.arrow.l > * {\n  left: 0;\n  transform: rotate(135deg); }\n\n.arrow.r {\n  right: 0;\n  cursor: e-resize; }\n\n.arrow.r > * {\n  right: 0;\n  transform: rotate(-45deg); }\n\n/* drop shadow */\n.arrow > *, #cross {\n  filter: drop-shadow(-1px -1px 3px #000);\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n  color: white;\n  z-index: 3; }\n\n/* slot elements css */\nslot[name=preview]::slotted(*) {\n  height: 64px;\n  opacity: 0.5; }\n\nslot[name=preview]::slotted(*.active) {\n  border: 1px solid white;\n  opacity: 1; }\n\nsifrr-tab-header {\n  height: 64px; }\n\n/* Full screen css */\n:host(.fullscreen) {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  z-index: 9999; }\n  :host(.fullscreen) #bg {\n    display: block;\n    z-index: 1; }\n  :host(.fullscreen) #preview, :host(.fullscreen) #content {\n    position: absolute;\n    left: 0;\n    right: 0;\n    margin: auto; }\n  :host(.fullscreen) #preview {\n    bottom: 30px;\n    max-width: 90%;\n    z-index: 2; }\n  :host(.fullscreen) #content {\n    z-index: 2;\n    max-width: 90%;\n    max-height: calc(100% - 150px);\n    top: calc(50% - 55px);\n    transform: translateY(-50%);\n    overflow: hidden; }\n";

  var css$1 = ":host {\n  /* CSS for tabs container */\n  display: block;\n  width: 100%;\n  position: relative;\n  overflow-x: auto;\n  box-sizing: border-box; }\n\nslot {\n  display: block;\n  min-width: 100%; }\n\nslot::slotted(*) {\n  float: left;\n  text-align: center;\n  vertical-align: middle;\n  opacity: 0.7;\n  cursor: pointer; }\n\nslot::slotted(*.active) {\n  opacity: 1; }\n\nslot::slotted(*:hover) {\n  opacity: 0.9; }\n\n/* CSS for line under active tab heading */\n.underline {\n  position: absolute;\n  bottom: 0;\n  height: 3px;\n  background: white; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n  slot::slotted(*) {\n    ${this.options ? this.options.style : ''}\n  }\n  :host {\n    padding-bottom: ${this.options && this.options.showUnderline ? '3px' : '0'};\n  }\n</style>\n<slot>\n</slot>\n<div class=\"underline\"></div>"], ["<style media=\"screen\">\n  ", "\n  slot::slotted(*) {\n    \\${this.options ? this.options.style : ''}\n  }\n  :host {\n    padding-bottom: \\${this.options && this.options.showUnderline ? '3px' : '0'};\n  }\n</style>\n<slot>\n</slot>\n<div class=\"underline\"></div>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const template = SifrrDom.template(_templateObject(), css$1);
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

  var css$2 = ":host {\n  box-sizing: border-box;\n  width: 100%;\n  display: block;\n  position: relative;\n  overflow-x: auto;\n  margin: 0; }\n\n.tabs {\n  min-height: 1px;\n  display: block; }\n\n.tabs::slotted(*) {\n  float: left;\n  max-height: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  vertical-align: middle;\n  box-sizing: border-box; }\n";

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var sifrr_animate = createCommonjsModule(function (module, exports) {
  /*! sifrr-animate v0.0.3 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-animate */
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
          x1,
          y1,
          x2,
          y2,
          A: (x1, x2) => 1.0 - 3.0 * x2 + 3.0 * x1,
          B: (x1, x2) => 3.0 * x2 - 6.0 * x1,
          C: x1 => 3.0 * x1,
          CalcBezier: (t, x1, x2) => ((this.A(x1, x2) * t + this.B(x1, x2)) * t + this.C(x1)) * t,
          GetSlope: (t, x1, x2) => 3.0 * this.A(x1, x2) * t * t + 2.0 * this.B(x1, x2) * t + this.C(x1)
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
      easeInOut: [.42, 0, .58, 1],
      spring: [.3642, 0, .6358, 1]
    };
    var wait = t => new Promise(res => setTimeout(res, t));
    const digitRgx = /((?:[+\-*/]=)?-?\d+\.?\d*)/;
    const frames = new Set();
    function runFrames(currentTime) {
      frames.forEach(f => f(currentTime));
      window.requestAnimationFrame(runFrames);
    }
    window.requestAnimationFrame(runFrames);
    function animateOne({
      target,
      prop,
      from,
      to,
      time = 300,
      type = 'spring',
      onUpdate,
      round = false,
      delay = 0
    }) {
      const toSplit = to.toString().split(digitRgx),
            l = toSplit.length,
            raw = [],
            fromNums = [],
            diffs = [];
      const fromSplit = (from || target[prop] || '').toString().split(digitRgx);
      const onUp = typeof onUpdate === 'function';
      for (let i = 0; i < l; i++) {
        const fn = Number(fromSplit[i]) || 0;
        let tn = Number(toSplit[i]);
        if (toSplit[i][1] === '=') {
          tn = Number(toSplit[i].slice(2));
          switch (toSplit[i][0]) {
            case '+':
              tn = fn + tn;
              break;
            case '-':
              tn = fn - tn;
              break;
            case '*':
              tn = fn * tn;
              break;
            case '/':
              tn = fn / tn;
              break;
          }
        }
        if (isNaN(tn) || !toSplit[i]) raw.push(toSplit[i]);else {
          fromNums.push(fn);
          diffs.push(tn - fn);
        }
      }
      const rawObj = {
        raw
      };
      return wait(delay).then(() => new Promise((resolve, reject) => {
        if (types[type]) type = types[type];
        if (Array.isArray(type)) type = new bezier(type);else if (typeof type !== 'function') return reject(Error('type should be one of ' + Object.keys(types).toString() + ' or Bezier Array or Function, given ' + type));
        let startTime;
        const frame = function (currentTime) {
          startTime = startTime || currentTime - 17;
          const percent = (currentTime - startTime) / time,
                bper = type(percent >= 1 ? 1 : percent);
          const next = diffs.map((d, i) => {
            const n = bper * d + fromNums[i];
            return round ? Math.round(n) : n;
          });
          const val = String.raw(rawObj, ...next);
          try {
            target[prop] = Number(val) || val;
            if (onUp) onUpdate(target, prop, target[prop]);
            if (percent >= 1) resolve(frames.delete(frame));
          } catch (e) {
            frames.delete(frame);
            reject(e);
          }
        };
        frames.add(frame);
      }));
    }
    var animateone = animateOne;
    function animate({
      targets,
      target,
      to,
      time,
      type,
      onUpdate,
      round,
      delay
    }) {
      targets = targets ? Array.from(targets) : [target];
      function iterate(tg, props, d, ntime) {
        const promises = [];
        for (let prop in props) {
          let from, final;
          if (Array.isArray(props[prop])) [from, final] = props[prop];else final = props[prop];
          if (typeof props[prop] === 'object' && !Array.isArray(props[prop])) {
            promises.push(iterate(tg[prop], props[prop], d, ntime));
          } else {
            promises.push(animateone({
              target: tg,
              prop,
              to: final,
              time: ntime,
              type,
              from,
              onUpdate,
              round,
              delay: d
            }));
          }
        }
        return Promise.all(promises);
      }
      let numTo = to,
          numDelay = delay,
          numTime = time;
      return Promise.all(targets.map((target, i) => {
        if (typeof to === 'function') numTo = to.call(target, i);
        if (typeof delay === 'function') numDelay = delay.call(target, i);
        if (typeof time === 'function') numTime = time.call(target, i);
        return iterate(target, numTo, numDelay, numTime);
      }));
    }
    animate.types = types;
    animate.wait = wait;
    animate.animate = animate;
    animate.keyframes = arrOpts => {
      let promise = Promise.resolve(true);
      arrOpts.forEach(opts => {
        if (Array.isArray(opts)) promise = promise.then(() => Promise.all(opts.map(animate)));
        promise = promise.then(() => animate(opts));
      });
      return promise;
    };
    animate.loop = fxn => fxn().then(() => animate.loop(fxn));
    var animate_1 = animate;
    return animate_1;
  }));
  /*! (c) @aadityataparia */
  });

  function _templateObject$1() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<style media=\"screen\">\n  .tabs {\n    width: ${this.totalWidth};\n  }\n  .tabs::slotted(*) {\n    width: ${this.tabWidth};\n  }\n</style>\n<slot class=\"tabs\">\n</slot>"], ["<style media=\"screen\">\n  ", "\n</style>\n<style media=\"screen\">\n  .tabs {\n    width: \\${this.totalWidth};\n  }\n  .tabs::slotted(*) {\n    width: \\${this.tabWidth};\n  }\n</style>\n<slot class=\"tabs\">\n</slot>"]);
    _templateObject$1 = function () {
      return data;
    };
    return data;
  }
  const template$1 = SifrrDom.template(_templateObject$1(), css$2);
  class SifrrTabContainer extends SifrrDom.Element {
    static get template() {
      return template$1;
    }
    static observedAttrs() {
      return ['options'];
    }
    onConnect() {
      this._connected = true;
      this.refresh();
      window.addEventListener('resize', () => requestAnimationFrame(this.refresh.bind(this)));
      this.options.slot.addEventListener('slotchange', this.refresh.bind(this, {}));
      this.setScrollEvent();
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
        num: 1,
        animation: 'spring',
        animationTime: 300,
        scrollBreakpoint: 0.3,
        loop: false
      }, this._options, options);
      this.options = Object.assign({}, this._options, this._attrOptions);
      this.options.tabs = this.options.slot.assignedNodes().filter(n => n.nodeType === 1);
      this.total = this.options.tabs.length;
      if (!this.options.tabs || this.options.tabs.length < 1) return;
      if (this.options.num === 'auto') {
        this.tabWidth = 'auto';
        this._totalWidth = this.options.tabs.reduce((a, b) => a + b.getBoundingClientRect().width, 0);
        this.totalWidth = this._totalWidth + 'px';
      } else {
        this._tabWidth = this.getBoundingClientRect().width / this.options.num;
        this.tabWidth = this._tabWidth + 'px';
        this._totalWidth = this._tabWidth * this.options.tabs.length;
        this.totalWidth = this._totalWidth + 'px';
        this.active = typeof this._active === 'number' ? this._active : 0;
      }
    }
    setScrollEvent() {
      let me = this,
          isScrolling,
          scrollPos;
      if (this.options.num !== 'auto') this.options.content.addEventListener('scroll', onScroll);
      function onScroll() {
        scrollPos = me.active;
        const total = me.options.content.scrollLeft / me._tabWidth;
        const t = Math.round(total);
        me.onScrollPercent(total);
        clearTimeout(isScrolling);
        isScrolling = setTimeout(function () {
          if (total - scrollPos < -me.options.scrollBreakpoint) {
            me.active = Math.min(t, scrollPos - 1);
          } else if (total - scrollPos > +me.options.scrollBreakpoint) {
            me.active = Math.max(t, scrollPos + 1);
          } else {
            me.active = scrollPos;
          }
        }, 50);
      }
    }
    onScrollPercent() {}
    get active() {
      return this._active;
    }
    set active(i) {
      this._active = this.getTabNumber(i);
      this.update();
    }
    onUpdate() {
      if (!this.options || this.options.num === 'auto') return;
      const i = this._active;
      sifrr_animate({
        target: this.options.content,
        to: {
          scrollLeft: i * this._tabWidth
        },
        time: this.options.animationTime,
        type: this.options.animation === 'none' ? () => 1 : this.options.animation
      });
      for (let j = 0, l = this.options.tabs.length; j < l; j++) {
        const el = this.options.tabs[j];
        if (j === i) {
          if (el.onActive && !el.classList.contains('active')) el.onActive();
          el.classList.add('active');
        } else {
          if (el.onInactive && el.classList.contains('active')) el.onInactive();
          el.classList.remove('active');
        }
      }
    }
    next() {
      this.options.num === 'auto' ? this.options.content.scrollLeft += this._totalWidth / 2 : this.active += 1;
    }
    hasNext() {
      if (this.active === this.options.tabs.length - this.options.num) return false;
      return true;
    }
    prev() {
      this.options.num === 'auto' ? this.options.content.scrollLeft -= this._totalWidth / 2 : this.active -= 1;
    }
    hasPrev() {
      return this.active === 0 ? false : true;
    }
    getTabNumber(i) {
      const l = this.options.tabs.length;
      if (l < 1) return 0;
      const num = this.options.num;
      i = i < 0 ? i + l : i % l;
      if (i + num - 1 >= l) {
        i = this.options.loop ? i % l : l - num;
      }
      return i;
    }
  }
  SifrrDom.register(SifrrTabContainer);

  function _templateObject$2() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<style media=\"screen\">\n  ${this.state.style || ''}\n</style>\n<div id=\"bg\">\n  <div id=\"cross\">X</div>\n</div>\n<div id=\"content\">\n  <sifrr-tab-container>\n    <slot name=\"content\"></slot>\n  </sifrr-tab-container>\n  <span id=\"count\"></span>\n</div>\n<div id=\"preview\">\n  <div class=\"arrow l\">\n    <span></span>\n  </div>\n  <div class=\"arrow r\">\n    <span></span>\n  </div>\n  <sifrr-tab-header options='{ \"showUnderline\": false }'>\n    <slot name=\"preview\"></slot>\n  </sifrr-tab-header>\n</div>"], ["<style media=\"screen\">\n  ", "\n</style>\n<style media=\"screen\">\n  \\${this.state.style || ''}\n</style>\n<div id=\"bg\">\n  <div id=\"cross\">X</div>\n</div>\n<div id=\"content\">\n  <sifrr-tab-container>\n    <slot name=\"content\"></slot>\n  </sifrr-tab-container>\n  <span id=\"count\"></span>\n</div>\n<div id=\"preview\">\n  <div class=\"arrow l\">\n    <span></span>\n  </div>\n  <div class=\"arrow r\">\n    <span></span>\n  </div>\n  <sifrr-tab-header options='{ \"showUnderline\": false }'>\n    <slot name=\"preview\"></slot>\n  </sifrr-tab-header>\n</div>"]);
    _templateObject$2 = function () {
      return data;
    };
    return data;
  }
  const template$2 = SifrrDom.template(_templateObject$2(), css);
  class SifrrCarousel extends SifrrDom.Element {
    static get template() {
      return template$2;
    }
    onConnect() {
      this.container = this.$('sifrr-tab-container');
      this.header = this.$('sifrr-tab-header');
      this.container.refresh({
        slot: this.$('slot[name=content]')
      });
      this.header.refresh({
        slot: this.$('slot[name=preview]'),
        container: this.container
      });
      this._rel = this._rel || this.refresh.bind(this);
      Array.from(this.$$('img', false)).forEach(img => img.addEventListener('load', this._rel));
      SifrrDom.Event.addListener('click', this, (e, t) => {
        if ((t.matches('[slot=content]') || t.matches('[slot=content] *')) && !t.matches('.fullscreen *')) this.fullScreen(true);else if (t.matches('#bg') || t.matches('#bg *')) this.fullScreen(false);else if (t.matches('.arrow.l') || t.matches('.arrow.l span')) this.container.prev();else if (t.matches('.arrow.r') || t.matches('.arrow.r span')) this.container.next();
      });
      this.container._update = () => {
        this.$('#count').textContent = "".concat(this.container.active + 1, "/").concat(this.container.total);
      };
    }
    fullScreen(on = true) {
      if (on) {
        this.classList.add('fullscreen');
      } else {
        this.classList.remove('fullscreen');
      }
      this.refresh();
    }
    refresh() {
      this.container.refresh();
      this.header.refresh();
    }
  }
  SifrrCarousel.defaultState = {
    style: ''
  };
  SifrrDom.register(SifrrCarousel);

  return SifrrCarousel;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrcarousel.js.map
