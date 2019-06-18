/*! Sifrr.Elements v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@sifrr/dom'), require('@sifrr/storage')) :
  typeof define === 'function' && define.amd ? define(['exports', '@sifrr/dom', '@sifrr/storage'], factory) :
  (global = global || self, factory((global.Sifrr = global.Sifrr || {}, global.Sifrr.Elements = {}), global.Sifrr.Dom, global.Sifrr.Storage));
}(this, function (exports, SifrrDom, SifrrStorage) { 'use strict';

  SifrrDom = SifrrDom && SifrrDom.hasOwnProperty('default') ? SifrrDom['default'] : SifrrDom;
  SifrrStorage = SifrrStorage && SifrrStorage.hasOwnProperty('default') ? SifrrStorage['default'] : SifrrStorage;

  function moveAttr(el, attr) {
    if (!el.dataset[attr]) return;
    el.setAttribute(attr, el.dataset[attr]);
    el.removeAttribute("data-".concat(attr));
  }
  function loadPicture(pic) {
    if (pic.tagName === 'PICTURE') {
      pic.querySelectorAll('source').forEach(s => {
        moveAttr(s, 'src');
        moveAttr(s, 'srcset');
      });
      pic = pic.querySelector('img');
    } else if (pic.tagName !== 'IMG') {
      throw Error('LazyLoader only supports `picture` or `img` element. Given: ', pic);
    }
    moveAttr(pic, 'src');
    moveAttr(pic, 'srcset');
    return true;
  }
  function onVisible(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target._loaded) {
        entry.target._loaded = true;
        if (entry.target.beforeLoad) entry.target.beforeLoad();
        loadPicture(entry.target);
        this.unobserve(entry.target);
        if (entry.target.afterLoad) entry.target.afterLoad();
      }
    });
  }
  class LazyLoader extends window.IntersectionObserver {
    constructor(rootMargin = '0px 0px 0px 0px') {
      super(onVisible, {
        rootMargin
      });
    }
  }
  LazyLoader.prototype._observe = LazyLoader.prototype.observe;
  LazyLoader.prototype.observe = function (el) {
    el._loaded = false;
    this._observe(el);
  };
  var lazyloader = LazyLoader;

  class SifrrLazyImg extends SifrrDom.Element.extends(HTMLImageElement) {
    static get observer() {
      this._observer = this._observer || new lazyloader(this.rootMargin);
      return this._observer;
    }
    onConnect() {
      this.reload();
    }
    reload() {
      this.constructor.observer.observe(this);
    }
    onDisconnect() {
      this.constructor.observer.unobserve(this);
    }
  }
  SifrrLazyImg.rootMargin = '0px 0px 50px 0px';
  SifrrDom.register(SifrrLazyImg, {
    extends: 'img'
  });

  class SifrrLazyPicture extends SifrrDom.Element.extends(HTMLPictureElement) {
    static get observer() {
      this._observer = this._observer || new lazyloader(this.rootMargin);
      return this._observer;
    }
    onConnect() {
      this.reload();
    }
    reload() {
      this.constructor.observer.observe(this);
    }
    onDisconnect() {
      this.constructor.observer.unobserve(this);
    }
  }
  SifrrLazyPicture.rootMargin = '0px 0px 50px 0px';
  SifrrDom.register(SifrrLazyPicture, {
    extends: 'picture'
  });

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

  var css = ":host {\n  /* CSS for tabs container */\n  display: block;\n  width: 100%;\n  position: relative;\n  overflow-x: auto;\n  box-sizing: border-box;\n  padding-bottom: 3px; }\n\nslot {\n  display: block;\n  min-width: 100%; }\n\nslot::slotted(*) {\n  float: left;\n  text-align: center;\n  vertical-align: middle;\n  opacity: 0.7;\n  cursor: pointer; }\n\nslot::slotted(*.active) {\n  opacity: 1; }\n\nslot::slotted(*:hover) {\n  opacity: 0.9; }\n\n/* CSS for line under active tab heading */\n.underline {\n  position: absolute;\n  bottom: 0;\n  height: 3px;\n  background: white; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n  slot::slotted(*) {\n    ${this.options ? this.options.style : ''}\n  }\n</style>\n<slot>\n</slot>\n<div class=\"underline\"></div>"], ["<style media=\"screen\">\n  ", "\n  slot::slotted(*) {\n    \\${this.options ? this.options.style : ''}\n  }\n</style>\n<slot>\n</slot>\n<div class=\"underline\"></div>"]);
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
      this.options = Object.assign({
        content: this,
        slot: this.$('slot'),
        showUnderline: true,
        line: this.$('.underline'),
        container: null
      }, this.options, options, this._attrOptions);
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
        this.options.menuProps[i] = {
          width: elem.offsetWidth,
          left: left
        };
        left += elem.offsetWidth;
        elem._click = () => {
          if (this.options.container) this.options.container.active = i;else this.active = i;
        };
      });
      const last = this.options.menuProps[this.options.menus.length - 1];
      this.options.totalMenuWidth = last.left + last.width;
      this.$('slot').style.width = this.options.slot.style.width = last.left + last.width + 1 * this.options.menuProps.length + 'px';
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
      this.setMenuProps();
    }
  }
  SifrrDom.register(SifrrTabHeader);

  var css$1 = ":host {\n  box-sizing: border-box;\n  width: 100%;\n  display: block;\n  position: relative;\n  overflow-x: auto;\n  margin: 0; }\n\n.tabs {\n  min-height: 1px;\n  display: block; }\n\n.tabs::slotted(*) {\n  float: left;\n  max-height: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  vertical-align: middle;\n  box-sizing: border-box; }\n";

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
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<style media=\"screen\">\n  .tabs {\n    width: ${this.totalWidth + 'px'};\n  }\n  .tabs::slotted(*) {\n    width: ${this.tabWidth + 'px'};\n  }\n</style>\n<slot class=\"tabs\">\n</slot>"], ["<style media=\"screen\">\n  ", "\n</style>\n<style media=\"screen\">\n  .tabs {\n    width: \\${this.totalWidth + 'px'};\n  }\n  .tabs::slotted(*) {\n    width: \\${this.tabWidth + 'px'};\n  }\n</style>\n<slot class=\"tabs\">\n</slot>"]);
    _templateObject$1 = function () {
      return data;
    };
    return data;
  }
  const template$1 = SifrrDom.template(_templateObject$1(), css$1);
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
      this.options = Object.assign({
        content: this,
        slot: this.$('slot'),
        num: 1,
        animation: 'spring',
        animationTime: 300,
        scrollBreakpoint: 0.3,
        loop: false
      }, this.options, options, this._attrOptions);
      this.options.tabs = this.options.slot.assignedNodes().filter(n => n.nodeType === 1);
      this.total = this.options.tabs.length;
      if (!this.options.tabs || this.options.tabs.length < 1) return;
      this.tabWidth = this.clientWidth / this.options.num;
      this.totalWidth = this.tabWidth * this.options.tabs.length;
      this.active = typeof this._active === 'number' ? this._active : 0;
    }
    setScrollEvent() {
      let me = this,
          isScrolling,
          scrollPos;
      this.options.content.addEventListener('scroll', onScroll);
      function onScroll() {
        scrollPos = me.active;
        const total = me.options.content.scrollLeft / me.tabWidth;
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
      if (!this.options) return;
      const i = this._active;
      sifrr_animate({
        target: this.options.content,
        to: {
          scrollLeft: i * this.tabWidth
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
      this.active += 1;
    }
    hasNext() {
      if (this.active === this.options.tabs.length - this.options.num) return false;
      return true;
    }
    prev() {
      this.active -= 1;
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

  var css$2 = ":host {\n  position: fixed;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  max-width: 100%;\n  width: 320px;\n  z-index: 1000;\n  background-color: rgba(0, 0, 0, 0.8);\n  transform: translate3d(100%, 0, 0);\n  transition: all 0.2s ease; }\n\n:host(.show) {\n  transform: translate3d(0, 0, 0); }\n\n* {\n  box-sizing: border-box; }\n\n#showHide {\n  position: fixed;\n  left: -30px;\n  top: 0;\n  bottom: 0;\n  width: 30px;\n  height: 30px;\n  margin-top: 5px;\n  background-color: blue;\n  z-index: 2; }\n\n.stateContainer {\n  padding-left: 10px;\n  margin-left: 10px;\n  border-left: 1px solid white;\n  position: relative; }\n\n.stateContainer.off {\n  opacity: 0.5; }\n\n.stateContainer .dotC {\n  position: absolute;\n  top: 0;\n  left: -10px;\n  width: 20px;\n  height: 100%;\n  cursor: pointer; }\n\n.stateContainer .dotC .dot {\n  position: absolute;\n  top: 50%;\n  left: 10px;\n  width: 10px;\n  height: 10px;\n  transform: translate3d(-50%, -50%, 0);\n  background-color: white;\n  border-radius: 50%; }\n\n.stateContainer .delete {\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 4px;\n  background-color: rgba(0, 0, 0, 0.7);\n  color: white;\n  cursor: pointer; }\n\n.state {\n  white-space: pre-wrap;\n  max-height: 90px;\n  overflow: hidden;\n  background-color: rgba(255, 255, 255, 0.97);\n  padding: 5px;\n  margin-bottom: 5px;\n  position: relative;\n  cursor: pointer; }\n\n.state:hover::after {\n  content: '\\\\\\/';\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 0, 0.7);\n  text-align: center;\n  color: white; }\n\n.state.open {\n  max-height: none; }\n\n.state.open:hover::after {\n  content: '\\/\\\\'; }\n\n.key {\n  color: red; }\n\n.string {\n  color: green; }\n\n.number, .null, .boolean {\n  color: blue; }\n\nfooter {\n  position: absolute;\n  bottom: 0; }\n\ninput {\n  margin: 3px;\n  width: calc(100% - 6px);\n  padding: 3px; }\n\n.btn3 {\n  margin: 3px;\n  width: calc(33% - 8px);\n  padding: 3px;\n  background: white; }\n";

  function _templateObject$2() {
    const data = _taggedTemplateLiteral(["<style>\n  ", "\n</style>\n<div id=\"showHide\" _click=${this.showHide}></div>\n<sifrr-tab-header style='background: blue; color: white' data-sifrr-html=\"true\">\n  ${ this.headingHtml() }\n</sifrr-tab-header>\n<sifrr-tab-container style='height: calc(100vh - 132px)' data-sifrr-html=\"true\">\n  ${ this.stateHtml() }\n</sifrr-tab-container>\n<footer>\n  <input _keyup=${this.addTargetOnEnter} id=\"addTargetInput\" type=\"text\" name=\"addTargetInput\" value=\"\" placeholder=\"Enter css selector query of target\">\n  <button _click=${this.addTarget} class=\"btn3\" type=\"button\" name=\"addTargetButton\">Add Taget</button>\n  <button _click=${this.commitAll} class=\"btn3\" type=\"button\" name=\"commitAll\">Commit All</button>\n  <button _click=${this.resetAllToFirstState} class=\"btn3\" type=\"button\" name=\"resetAll\">Reset All</button>\n  <button _click=${this.saveData} class=\"btn3\" type=\"button\" name=\"saveData\">Save Data</button>\n  <button _click=${this.loadData} class=\"btn3\" type=\"button\" name=\"loadData\">Load Data</button>\n  <button _click=${this.clearAll} class=\"btn3\" type=\"button\" name=\"clearAll\">Remove All</button>\n</footer>"], ["<style>\n  ", "\n</style>\n<div id=\"showHide\" _click=\\${this.showHide}></div>\n<sifrr-tab-header style='background: blue; color: white' data-sifrr-html=\"true\">\n  \\${ this.headingHtml() }\n</sifrr-tab-header>\n<sifrr-tab-container style='height: calc(100vh - 132px)' data-sifrr-html=\"true\">\n  \\${ this.stateHtml() }\n</sifrr-tab-container>\n<footer>\n  <input _keyup=\\${this.addTargetOnEnter} id=\"addTargetInput\" type=\"text\" name=\"addTargetInput\" value=\"\" placeholder=\"Enter css selector query of target\">\n  <button _click=\\${this.addTarget} class=\"btn3\" type=\"button\" name=\"addTargetButton\">Add Taget</button>\n  <button _click=\\${this.commitAll} class=\"btn3\" type=\"button\" name=\"commitAll\">Commit All</button>\n  <button _click=\\${this.resetAllToFirstState} class=\"btn3\" type=\"button\" name=\"resetAll\">Reset All</button>\n  <button _click=\\${this.saveData} class=\"btn3\" type=\"button\" name=\"saveData\">Save Data</button>\n  <button _click=\\${this.loadData} class=\"btn3\" type=\"button\" name=\"loadData\">Load Data</button>\n  <button _click=\\${this.clearAll} class=\"btn3\" type=\"button\" name=\"clearAll\">Remove All</button>\n</footer>"]);
    _templateObject$2 = function () {
      return data;
    };
    return data;
  }
  const template$2 = SifrrDom.template(_templateObject$2(), css$2);
  SifrrDom.Event.add('click');
  SifrrDom.Event.add('keyup');
  class SifrrStater extends SifrrDom.Element {
    static get template() {
      return template$2;
    }
    onConnect() {
      let me = this;
      this.storage = new SifrrStorage({
        name: 'sifrr-stater' + window.location.href
      });
      SifrrDom.Event.addListener('click', '.state', function (e, el) {
        el.classList.contains('open') ? el.classList.remove('open') : el.classList.add('open');
      });
      SifrrDom.Event.addListener('click', '.dotC', function (e, target, el) {
        me.toState(parseInt(el.dataset.target), parseInt(el.dataset.stateIndex));
      });
      SifrrDom.Event.addListener('click', '.delete', function (e, el) {
        me.deleteState(parseInt(el.dataset.target), parseInt(el.dataset.stateIndex));
      });
      SifrrDom.Event.addListener('click', '.commit', function (e, el) {
        const i = parseInt(el.parentNode.dataset.target);
        me.commit(i);
      });
      SifrrDom.Event.addListener('click', '.reset', function (e, el) {
        const i = parseInt(el.parentNode.dataset.target);
        me.resetToFirstState(i);
      });
      SifrrDom.Event.addListener('click', '.remove', function (e, el) {
        const i = parseInt(el.parentNode.dataset.target);
        me.removeTarget(i);
      });
    }
    showHide() {
      this.classList.contains('show') ? this.classList.remove('show') : this.classList.add('show');
    }
    addTargetOnEnter(event) {
      if (event.key === 'Enter') {
        this.addTarget();
      }
    }
    headingHtml() {
      return this.state.queries.map(q => "<span>".concat(q, "</span>")).join('');
    }
    stateHtml() {
      let me = this;
      return this.state.states.map((s, i) => "<div data-target=\"".concat(i, "\">\n      <button class=\"btn3 commit\" type=\"button\" name=\"commit\">Commit</button>\n      <button class=\"btn3 reset\" type=\"button\" name=\"reset\">Reset</button>\n      <button class=\"btn3 remove\" type=\"button\" name=\"remove\">Remove</button>\n      ").concat(s.map((jsn, j) => "<div class=\"stateContainer ".concat(j <= me.state.activeStates[i] ? 'on' : 'off', "\">\n                           <div class=\"dotC\" data-target=\"").concat(i, "\" data-state-index=\"").concat(j, "\"><div class=\"dot\"></div></div>\n                           <div class=\"state\">").concat(SifrrStater.prettyJSON(jsn), "</div>\n                           <div class=\"delete\" data-target=\"").concat(i, "\" data-state-index=\"").concat(j, "\">X</div>\n                           </div>")).join(''), "</div>")).join('');
    }
    addTarget(query) {
      if (typeof query !== 'string') query = this.$('#addTargetInput').value;
      let target = window.document.querySelector(query);
      if (!target.isSifrr) {
        window.console.log('Invalid Sifrr Element.', target);
        return false;
      }
      if (!target.state) {
        window.console.log('Sifrr Element has no state.', target);
        return false;
      }
      const old = target.onStateChange,
            me = this;
      target.onStateChange = function () {
        me.addState(this, this.state);
        old.call(this);
      };
      let index = this.state.targets.indexOf(target);
      if (index > -1) return;
      this.state.targets.push(target);
      this.state.queries.push(query);
      index = this.state.targets.indexOf(target);
      this.state.states[index] = [JSON.parse(JSON.stringify(target.state))];
      this.state.activeStates[index] = 0;
      this.update();
    }
    removeTarget(el) {
      const {
        index
      } = this.getTarget(el);
      if (index > -1) {
        this.state.targets.splice(index, 1);
        this.state.queries.splice(index, 1);
        this.state.states.splice(index, 1);
        this.state.activeStates.splice(index, 1);
        this.update();
      }
    }
    addState(el, state) {
      const {
        index
      } = this.getTarget(el);
      if (index > -1) {
        const active = this.state.activeStates[index];
        const newState = JSON.stringify(state);
        if (newState !== JSON.stringify(this.state.states[index][active])) {
          this.state.states[index].splice(active + 1, 0, JSON.parse(newState));
          this.state.activeStates[index] = active + 1;
          this.update();
        }
      }
    }
    deleteState(el, stateN) {
      const {
        index
      } = this.getTarget(el);
      this.state.states[index].splice(stateN, 1);
      if (stateN < this.state.activeStates[index]) {
        this.state.activeStates[index] -= 1;
      } else if (stateN == this.state.activeStates[index]) {
        this.state.activeStates[index] -= 1;
        this.toState(index, this.state.activeStates[index]);
      }
      this.update();
    }
    commit(el) {
      const {
        index
      } = this.getTarget(el);
      const last_state = this.state.states[index][this.state.states[index].length - 1];
      this.state.states[index] = [last_state];
      this.state.activeStates[index] = 0;
      this.update();
    }
    commitAll() {
      const me = this;
      this.state.targets.forEach(t => me.commit(t));
      this.update();
    }
    toState(el, n) {
      const {
        index,
        target
      } = this.getTarget(el);
      this.state.activeStates[index] = n;
      target.state = this.state.states[index][n];
      this.update();
    }
    resetToFirstState(el) {
      const {
        index,
        target
      } = this.getTarget(el);
      this.toState(target, 0, false);
      this.state.states[index] = [this.state.states[index][0]];
      this.update();
    }
    resetAllToFirstState() {
      const me = this;
      this.state.targets.forEach(t => me.resetToFirstState(t));
      this.update();
    }
    clear(target) {
      const {
        index
      } = this.getTarget(target);
      this.state.activeStates[index] = -1;
      this.state.states[index] = [];
      this.update();
    }
    clearAll() {
      const me = this;
      this.state.targets.forEach(t => me.clear(t));
      this.update();
    }
    saveData() {
      const me = this;
      this.storage.clear().then(() => {
        me.state.queries.forEach((q, i) => {
          const data = {
            active: me.state.activeStates[i],
            states: me.state.states[i]
          };
          me.storage.set(q, data);
        });
      });
    }
    loadData() {
      const me = this;
      this.storage.all().then(data => {
        let i = 0;
        for (let q in data) {
          me.addTarget(q);
          me.clear(i);
          data[q].states.forEach(s => me.addState(i, s));
          me.toState(i, data[q].active);
          i++;
        }
      });
    }
    getTarget(target) {
      let index;
      if (Number.isInteger(target)) {
        index = target;
        target = this.state.targets[index];
      } else {
        index = this.state.targets.indexOf(target);
      }
      return {
        index: index,
        target: target
      };
    }
    static prettyJSON(json) {
      json = JSON.stringify(json, null, 4);
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/:$/.test(match)) {
          cls = 'key';
          return '<span class="' + cls + '">' + match + '</span>';
        } else if (/^"/.test(match)) {
          cls = 'string';
        } else if (/true|false/.test(match)) {
          cls = 'boolean';
        } else if (/null/.test(match)) {
          cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    }
  }
  SifrrStater.defaultState = {
    targets: [],
    states: [],
    queries: [],
    activeStates: []
  };
  SifrrDom.register(SifrrStater);

  var css$3 = "* {\n  box-sizing: border-box; }\n\n.font {\n  font-family: Roboto, Ariel; }\n\n.container {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-wrap: nowrap;\n  background-color: #3a3f5a; }\n\n#sidemenu {\n  width: 15%;\n  height: 100%; }\n\n#sidemenu > * {\n  height: 100%; }\n\nsifrr-single-showcase {\n  width: 85%;\n  height: 100%;\n  display: block; }\n\n#sidebar {\n  width: 30%;\n  height: 100%; }\n\n#sidebar > * {\n  height: 33.33%; }\n\n#main {\n  width: 70%;\n  height: 100%; }\n\n.current {\n  background: #5f616d; }\n\n.flex-column {\n  height: 100%;\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: column; }\n\n.box {\n  width: 100%;\n  overflow: scroll;\n  border: 1px solid #5f616d; }\n\n#element {\n  padding: 20px;\n  height: 70%; }\n\n#code {\n  height: 30%; }\n\n#code sifrr-code-editor {\n  height: calc(100% - 48px) !important; }\n\n.head {\n  color: #cccccc;\n  text-align: center; }\n\n.small {\n  color: #8f9cb3;\n  font-size: 16px;\n  line-height: 24px;\n  padding: 4px; }\n\n#error, #status {\n  color: red; }\n\nsifrr-code-editor {\n  height: calc(100% - 24px); }\n\nul {\n  padding: 8px;\n  margin: 0; }\n\n#variants {\n  height: calc(100% - 86px);\n  overflow-y: scroll; }\n\n.variant, .showcase {\n  list-style-type: none;\n  border-bottom: 1px solid #5f616d; }\n  .variant span, .showcase span {\n    color: red;\n    float: right;\n    margin-right: 10px; }\n\n#saver, #loader {\n  color: green;\n  padding: 4px;\n  margin: 0; }\n\nbutton, .button {\n  position: relative;\n  display: inline-block;\n  background: #cccccc;\n  border: 1px solid grey;\n  color: #3a3f5a;\n  font-size: 14px;\n  padding: 4px; }\n  button input, .button input {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    opacity: 0; }\n";

  const html = "<div class=\"container\">\n  <div class=\"flex-column\" id=\"sidebar\">\n    <div class=\"box\">\n      <h3 class=\"font head\">Variants</h3>\n      <input id=\"variantName\" type=\"text\" name=\"variantName\" value=\"${this.state.variantName}\" data-sifrr-bind=\"variantName\">\n      <button class=\"font\" type=\"button\" name=\"createVariant\" _click=\"${this.createNewVariant}\">Create new variant</button>\n      <style media=\"screen\">\n        #variant${this.state.variantId} {\n          background: #5f616d;\n        }\n      </style>\n      <div id=\"variants\">\n        <div data-sifrr-repeat=\"${this.state.variants}\">\n          <li class=\"font variant small\" data-variant-id=\"${this.state.variantId}\" id=\"variant${this.state.variantId}\">${this.state.variantName}<span>X</span></li>\n        </div>\n      </div>\n    </div>\n    <div class=\"box\">\n      <label class=\"font small\" for=\"style\">Element CSS Styles</label>\n      <sifrr-code-editor lang=\"css\" data-sifrr-bind=\"style\" value=\"${this.state.style}\"></sifrr-code-editor>\n    </div>\n    <div class=\"box\">\n      <label class=\"font small\" for=\"elState\">Element State Function</label>\n      <sifrr-code-editor id=\"elState\" lang=\"js\" data-sifrr-bind=\"elState\" value=\"${this.state.elState}\"></sifrr-code-editor>\n    </div>\n  </div>\n  <div class=\"flex-column\" id=\"main\">\n    <div class=\"box\" id=\"element\" data-sifrr-html=\"true\">\n      ${this.state.code}\n    </div>\n    <div class=\"box\" id=\"code\">\n      <label class=\"font small\" for=\"elementName\">Element Name</label>\n      <input type=\"text\" name=\"elementName\" placeholder=\"Enter element name here...\" _input=\"${this.updateHtml}\" value=\"${this.state.element}\">\n      <label class=\"font small\" for=\"customUrl\">Custom Url</label>\n      <input type=\"text\" name=\"customUrl\" placeholder=\"Enter element url here...\" value=\"${this.state.elementUrl}\" data-sifrr-bind=\"elementUrl\">\n      <label class=\"font small\" for=\"elementName\">Is JS File</label>\n      <select id=\"isjs\" name=\"isjs\" value=\"${this.state.isjs}\" data-sifrr-bind=\"isjs\">\n        <option value=\"true\">true</option>\n        <option value=\"false\">false</option>\n      </select>\n      <span class=\"font\" id=\"error\"></span>\n      <br>\n      <label class=\"font small\" for=\"htmlcode\">HTML Code</label>\n      <sifrr-code-editor lang=\"html\" data-sifrr-bind=\"code\" value=\"${this.state.code}\"></sifrr-code-editor>\n    </div>\n  </div>\n</div>";

  var css$4 = ":host {\n  display: block;\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\npre, code {\n  width: 100%;\n  display: block; }\n\n.hljs {\n  width: 100%;\n  height: 100%;\n  font-family: Consolas,Liberation Mono,Courier,monospace;\n  font-size: 14px;\n  line-height: 18px;\n  padding: 8px;\n  margin: 0;\n  position: absolute;\n  white-space: pre-wrap;\n  top: 0;\n  left: 0; }\n\n.hljs * {\n  word-break: break-word; }\n\ntextarea {\n  z-index: 2;\n  resize: none;\n  border: none; }\n\ntextarea.loaded {\n  background: transparent !important;\n  text-shadow: 0px 0px 0px rgba(0, 0, 0, 0);\n  text-fill-color: transparent;\n  -webkit-text-fill-color: transparent; }\n\npre {\n  z-index: 1; }\n";

  function _templateObject$3() {
    const data = _taggedTemplateLiteral(["\n<style media=\"screen\">\n  ", "\n</style>\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/${this.theme}.min.css\">\n<pre class='hljs'>\n  <code id=\"highlight\" data-sifrr-html=\"true\">\n    ${this.htmlValue}\n  </code>\n</pre>\n<textarea class='hljs' _input=\"${this.input}\"></textarea>"], ["\n<style media=\"screen\">\n  ", "\n</style>\n<link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/\\${this.theme}.min.css\">\n<pre class='hljs'>\n  <code id=\"highlight\" data-sifrr-html=\"true\">\n    \\${this.htmlValue}\n  </code>\n</pre>\n<textarea class='hljs' _input=\"\\${this.input}\"></textarea>"]);
    _templateObject$3 = function () {
      return data;
    };
    return data;
  }
  const template$3 = SifrrDom.template(_templateObject$3(), css$4);
  class SifrrCodeEditor extends SifrrDom.Element {
    static get template() {
      return template$3;
    }
    static observedAttrs() {
      return ['value', 'theme'];
    }
    static hljs() {
      this._hljs = this._hljs || SifrrDom.Loader.executeJS('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js');
      return this._hljs;
    }
    onAttributeChange() {
      this.update();
    }
    onConnect() {
      this.constructor.hljs().then(() => this.hljsLoaded());
      const txtarea = this.$('textarea');
      txtarea.addEventListener('keydown', e => {
        let keyCode = e.keyCode || e.which;
        this.$('#highlight').style.height = this.$('textarea').height;
        if (keyCode == 9) {
          e.preventDefault();
          const start = txtarea.selectionStart;
          const end = txtarea.selectionEnd;
          const tabCharacter = '  ';
          const tabOffset = 2;
          txtarea.value = txtarea.value.substring(0, start) + tabCharacter + txtarea.value.substring(end);
          txtarea.selectionStart = txtarea.selectionEnd = start + tabOffset;
          this.update();
        }
      });
      txtarea.onscroll = () => {
        this.$('pre.hljs').scrollTop = txtarea.scrollTop;
      };
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
      if (window.hljs) return window.hljs.highlight(this.lang, this.value.replace(/\n$/, '\n\n')).value;else return this.value.replace(/</g, '&lt;');
    }
    get theme() {
      return this.getAttribute('theme') || 'atom-one-dark';
    }
    set theme(v) {
      this.setAttribute('theme', v);
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
  SifrrDom.register(SifrrCodeEditor);

  function _templateObject$4() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<style>\n${this.state.style}\n</style>\n", ""], ["<style media=\"screen\">\n  ", "\n</style>\n<style>\n\\${this.state.style}\n</style>\n", ""]);
    _templateObject$4 = function () {
      return data;
    };
    return data;
  }
  const template$4 = SifrrDom.template(_templateObject$4(), css$3, html);
  SifrrDom.Event.add('click');
  const defaultShowcase = {
    id: 1,
    name: 'Placeholder Element',
    element: 'sifrr-placeholder',
    elementUrl: '',
    isjs: true,
    variantName: '',
    variants: [{
      variantId: 1,
      variantName: 'variant',
      style: "#element > * {\n  display: block;\n  background-color: white;\n  margin: auto;\n}",
      code: '<sifrr-placeholder>\n</sifrr-placeholder>',
      elState: 'return {\n\n}'
    }]
  };
  class SifrrSingleShowcase extends SifrrDom.Element {
    static get template() {
      return template$4;
    }
    static observedAttrs() {
      return ['url'];
    }
    onConnect() {
      this.switchVariant();
      SifrrDom.Event.addListener('click', '.variant', (e, el) => {
        if (el.matches('.variant')) this.switchVariant(el.dataset.variantId);
        if (el.matches('.variant span')) this.deleteVariant(el.parentNode.dataset.variantId);
      });
    }
    beforeUpdate() {
      this.saveVariant();
      if (!this.state.elemnt) return;
      if (this._element !== this.state.element || this._js !== this.state.isjs || this._url !== this.state.elementUrl) {
        SifrrDom.load(this.state.element, {
          js: this.state.isjs == 'true',
          url: this.state.elementUrl ? this.state.elementUrl : undefined
        }).then(() => this.$('#error').innerText = '').catch(e => this.$('#error').innerText = e.message);
        this._js = this.state.isjs;
        this._element = this.state.element;
        this._url = this.state.elementUrl;
      }
    }
    onUpdate() {
      if (this._stateFxnTimeout) clearTimeout(this._stateFxnTimeout);
      this._stateFxnTimeout = setTimeout(this.runStateFunction.bind(this), 500);
    }
    runStateFunction() {
      let state;
      try {
        state = new Function(this.$('#elState').value).call(this.element());
      } catch (e) {
        window.console.warn(e);
      }
      if (state && this.element() && this.element().isSifrr && this.element().state !== state) {
        this.element().state = state;
      }
    }
    onAttributeChange(name, _, value) {
      if (name === 'url') this.url = value;
    }
    createNewVariant() {
      const id = Math.max(...this.state.variants.map(s => s.variantId), 0) + 1;
      const cid = this.state.variants.findIndex(v => v.variantId == this.state.variantId) + 1 || 1;
      this.state.variants.splice(cid, 0, Object.assign({}, {
        variantId: id,
        variantName: this.state.variantName,
        style: this.state.style || '',
        code: this.state.code || '',
        elState: this.state.elState || ''
      }));
      this.switchVariant(id);
    }
    deleteVariant(id) {
      this.state.variants.forEach((s, i) => {
        if (s.variantId == id) {
          this.state.variants.splice(i, 1);
          if (this.state.variantId == id) this.switchVariant((this.state.variants[i] || {}).variantId);else this.update();
        }
      });
    }
    saveVariant() {
      if (!this.state.variants) this.state.variants = [];
      const id = this.state.variantId;
      this.state.variants.forEach(s => {
        if (s.variantId == id) {
          Object.assign(s, {
            variantName: this.state.variantName,
            style: this.state.style,
            code: this.state.code,
            elState: this.state.elState
          });
        }
      });
    }
    switchVariant(id) {
      this.$('#element').textContent = '';
      Object.assign(this.state, this.variant(id));
      this.update();
    }
    updateHtml(e, el) {
      const html = "<".concat(el.value, "></").concat(el.value, ">");
      this.state = {
        code: html,
        element: el.value
      };
    }
    element() {
      return this.$('#element').firstElementChild;
    }
    variant(id) {
      return this.state.variants.find(s => s.variantId == id) || this.state.variants[this.state.variants.length - 1];
    }
  }
  SifrrSingleShowcase.defaultState = defaultShowcase;
  SifrrDom.register(SifrrSingleShowcase);

  function _templateObject$5() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<div class=\"container\">\n  <div class=\"flex-column\" id=\"sidemenu\">\n    <div class=\"box\">\n      <h1 class=\"font head\">Sifrr Showcase</h1>\n      <p class=\"font\" id=\"loader\"></p>\n      <input id=\"url\" type=\"text\" placeholder=\"Enter url here...\" name=\"url\" />\n      <button type=\"button\" name=\"loadUrl\" _click=${this.loadUrl}>Load from url</button>\n      <p class=\"font\" id=\"status\"></p>\n      <span class=\"button font\">\n        Upload File\n        <input type=\"file\" name=\"file\" accept=\"application/json\" _input=\"${this.loadFile}\" />\n      </span>\n      <button class=\"font\" type=\"button\" name=\"saveFile\" _click=\"${this.saveFile}\">Save to File</button>\n      <h3 class=\"font head\">Showcases</h3>\n      <input id=\"showcaseName\" type=\"text\" name=\"showcase\" _input=${this.changeName} value=${this.state.showcases[this.state.current].name}>\n      <button class=\"font\" type=\"button\" name=\"createVariant\" _click=\"${this.createShowcase}\">Create new showcase</button>\n      <div id=\"showcases\" data-sifrr-repeat=\"${this.state.showcases}\">\n        <li class=\"font showcase small ${this._root ? (this.state.id === this._root.state.currentSC.id ? 'current' : '') : ''}\" data-showcase-id=\"${this.state.key}\" draggable=\"true\">${this.state.name}<span>X</span></li>\n      </div>\n    </div>\n  </div>\n  <sifrr-single-showcase _update=${this.saveShowcase} _state=${this.state.currentSC} data-sifrr-bind=\"currentSC\"></sifrr-single-showcase>\n</div>"], ["<style media=\"screen\">\n  ", "\n</style>\n<div class=\"container\">\n  <div class=\"flex-column\" id=\"sidemenu\">\n    <div class=\"box\">\n      <h1 class=\"font head\">Sifrr Showcase</h1>\n      <p class=\"font\" id=\"loader\"></p>\n      <input id=\"url\" type=\"text\" placeholder=\"Enter url here...\" name=\"url\" />\n      <button type=\"button\" name=\"loadUrl\" _click=\\${this.loadUrl}>Load from url</button>\n      <p class=\"font\" id=\"status\"></p>\n      <span class=\"button font\">\n        Upload File\n        <input type=\"file\" name=\"file\" accept=\"application/json\" _input=\"\\${this.loadFile}\" />\n      </span>\n      <button class=\"font\" type=\"button\" name=\"saveFile\" _click=\"\\${this.saveFile}\">Save to File</button>\n      <h3 class=\"font head\">Showcases</h3>\n      <input id=\"showcaseName\" type=\"text\" name=\"showcase\" _input=\\${this.changeName} value=\\${this.state.showcases[this.state.current].name}>\n      <button class=\"font\" type=\"button\" name=\"createVariant\" _click=\"\\${this.createShowcase}\">Create new showcase</button>\n      <div id=\"showcases\" data-sifrr-repeat=\"\\${this.state.showcases}\">\n        <li class=\"font showcase small \\${this._root ? (this.state.id === this._root.state.currentSC.id ? 'current' : '') : ''}\" data-showcase-id=\"\\${this.state.key}\" draggable=\"true\">\\${this.state.name}<span>X</span></li>\n      </div>\n    </div>\n  </div>\n  <sifrr-single-showcase _update=\\${this.saveShowcase} _state=\\${this.state.currentSC} data-sifrr-bind=\"currentSC\"></sifrr-single-showcase>\n</div>"]);
    _templateObject$5 = function () {
      return data;
    };
    return data;
  }
  const template$5 = SifrrDom.template(_templateObject$5(), css$3);
  const storage = new SifrrStorage({
    name: 'showcases',
    version: '1.0'
  });
  class SifrrShowcase extends SifrrDom.Element {
    static get template() {
      return template$5;
    }
    static observedAttrs() {
      return ['url'];
    }
    onAttributeChange(n, _, value) {
      if (n === 'url') this.url = value;
    }
    onConnect() {
      SifrrDom.Event.addListener('click', '.showcase', (e, el) => {
        if (el.matches('.showcase')) this.switchShowcase(this.getChildIndex(el));
        if (el.matches('.showcase span')) this.deleteShowcase(this.getChildIndex(el.parentNode));
      });
      this.loadUrl();
      this.switchShowcase(0);
      if (window.Sortable) {
        const me = this;
        new window.Sortable(this.$('#showcases'), {
          draggable: 'li',
          onEnd: e => {
            const o = e.oldIndex,
                  n = e.newIndex;
            const old = me.state.showcases[o];
            me.state.showcases[o] = me.state.showcases[n];
            me.state.showcases[n] = old;
            const current = me.$('#showcases .current');
            me.switchShowcase(me.getChildIndex(current));
          }
        });
      }
    }
    getChildIndex(el) {
      let i = 0;
      while ((el = el.previousElementSibling) != null) i++;
      return i;
    }
    deleteShowcase(i) {
      this.state.showcases.splice(i, 1);
      if (i == this.state.current) this.switchShowcase(this.state.current);else this.switchShowcase(this.state.current - 1);
    }
    createShowcase() {
      this.state.showcases.splice(this.state.current + 1, 0, {
        name: this.$('#showcaseName').value,
        variants: [],
        element: this.$('#showcaseName').value
      });
      this.switchShowcase(this.state.current + 1);
    }
    switchShowcase(i) {
      this.current = i;
      this.$('#showcases').children[this.state.current].classList.remove('current');
      if (!this.state.showcases[i]) i = this.state.showcases.length - 1;
      this.state = {
        current: i,
        currentSC: this.state.showcases[i]
      };
      this.$('#showcases').children[i].classList.add('current');
    }
    onStateChange() {
      if (this.state.current !== this.current) this.switchShowcase(this.state.current);
    }
    saveShowcase() {
      this.state.showcases[this.state.current] = Object.assign(this.state.showcases[this.state.current], this.state.currentSC);
      if (this._loaded) {
        this.$('#status').textContent = 'saving locally!';
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
          this._timeout = null;
          storage.set({
            showcases: this.state.showcases,
            current: this.state.current
          }).then(() => {
            this.$('#status').textContent = 'saved locally!';
          });
        }, 500);
      }
    }
    changeName() {
      this.state.showcases[this.state.current].name = this.$('#showcaseName').value;
      this.update();
    }
    get el() {
      return this.$('sifrr-single-showcase');
    }
    set url(v) {
      this._url = v;
      if (this.getAttribute('url') !== v) this.setAttribute('url', v);
      if (this.$('#url').value !== v) this.$('#url').value = v;
      this.loadUrl();
    }
    get url() {
      return this._url;
    }
    loadUrl() {
      this._url = this.$('#url').value;
      window.fetch(this._url).then(resp => resp.json()).then(v => {
        this.state.showcases = v.showcases;
        this.switchShowcase(v.current);
        this.$('#status').textContent = 'loaded from url!';
      }).catch(e => {
        this.$('#status').textContent = e.message;
        storage.all().then(v => {
          this.$('#status').textContent = 'failed to load from url, loaded from storage!';
          this._loaded = true;
          if (Array.isArray(v.showcases)) {
            this.state.showcases = v.showcases;
            this.switchShowcase(v.current);
          }
        });
      });
    }
    saveFile() {
      const blob = new Blob([JSON.stringify(this.state, null, 2)], {
        type: 'application/json'
      });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'showcases';
      a.click();
    }
    loadFile(e, el) {
      const file = el.files[0];
      const fr = new FileReader();
      fr.onload = () => {
        const json = JSON.parse(fr.result);
        this.state = json;
        this.switchShowcase(json.current);
        this.$('#status').textContent = 'loaded from file!';
      };
      fr.readAsText(file);
    }
  }
  SifrrShowcase.defaultState = {
    current: 0,
    showcases: [{
      name: 'new'
    }]
  };
  SifrrDom.register(SifrrShowcase);

  const template$6 = "<div class=\"circle back\">\n</div>\n<div class=\"circle front ${this.state.progress > 50 ? 'over50' : ''}\">\n  <div class=\"bar right\"></div>\n  <div class=\"bar left\"></div>\n</div>\n";

  var css$5 = ":host {\n  display: inline-block;\n  position: relative;\n}\n\n:host * {\n  box-sizing: border-box;\n}\n\n/* absolute positioning */\n.circle, .bar {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  top: 0;\n  left: 0;\n}\n\n/* borders */\n.back.circle {\n  border: 2px solid rgba(255, 255, 255, 0.6);\n}\n\n.bar, .over50 .bar.right {\n  border: 2px solid \"${this.hasAttribute('dark') ? '#000000' : '#ffffff'}\";\n}\n\n/* clipping */\n.front.circle {\n  /* right half */\n  -webkit-clip-path: polygon(50% 0, 101% 0%, 100% 100%, 50% 100%);\n          clip-path: polygon(50% 0, 101% 0%, 100% 100%, 50% 100%);\n}\n\n.front.circle.over50 {\n  /* full */\n  -webkit-clip-path: polygon(0 0, 101% 0, 100% 100%, 0 100%);\n          clip-path: polygon(0 0, 101% 0, 100% 100%, 0 100%);\n}\n\n.bar.left {\n  /* left half */\n  -webkit-clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);\n          clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);\n}\n\n.over50 .bar.right {\n  /* right half */\n  -webkit-clip-path: polygon(50% 0, 101% 0%, 100% 100%, 50% 100%);\n          clip-path: polygon(50% 0, 101% 0%, 100% 100%, 50% 100%);\n}\n\n/* progress */\n.bar.left {\n  transform: rotate(\"${this.state.progress * 360 / 100}\"deg)\n}\n\n.bar.right {\n  display: none;\n}\n\n.over50 .bar.right {\n  display: block;\n}\n";

  const properStyle = css$5.replace(/"(\${.*})"/g, '$1');
  class SifrrProgressRound extends SifrrDom.Element {
    static get template() {
      return SifrrDom.template("<style>".concat(properStyle, "</style>").concat(template$6));
    }
    static observedAttrs() {
      return ['progress'];
    }
    get progress() {
      return this._state.progress;
    }
    set progress(v) {
      return this.state = {
        progress: v
      };
    }
    onAttributeChange(n, _, v) {
      if (n === 'progress') this.state = {
        [n]: v
      };
    }
  }
  SifrrProgressRound.defaultState = {
    progress: 0
  };
  SifrrDom.register(SifrrProgressRound);

  var css$6 = ":host {\n  background: linear-gradient(to right, \"${this.bgColor}\" 4%, \"${this.fgColor}\" 25%, \"${this.bgColor}\" 36%);\n  display: inline-block;\n  animation: shimmer 2.5s linear 0s infinite;\n  background-size: 2000px 100%;\n}\n@keyframes shimmer{\n  0% { background-position: -2000px 0 }\n  100% { background-position: 2000px 0 }\n}\n";

  const properStyle$1 = css$6.replace(/"(\${[^"]*})"/g, '$1');
  function rgbToHsl(r = 0, g = 0, b = 0) {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h,
        s,
        l = (max + min) / 2;
    if (max == min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  }
  class SifrrShimmer extends SifrrDom.Element {
    static syncedAttrs() {
      return ['color', 'bg-color', 'fg-color'];
    }
    static get template() {
      return SifrrDom.template("<style>".concat(properStyle$1, "</style>"));
    }
    get bgColor() {
      return this['bg-color'] || this.colora(0.15);
    }
    get fgColor() {
      return this['fg-color'] || this.colora(0);
    }
    colora(point) {
      const hsl = rgbToHsl(...(this.color || '170, 170, 170').replace(/ /g, '').split(',').map(Number));
      const l = Math.min(hsl[2] + (this.isLight() ? point : -1 * point), 1);
      return "hsl(".concat(hsl[0] * 359, ", ").concat(hsl[1] * 100, "%, ").concat(l * 100, "%)");
    }
    isLight() {
      return this.hasAttribute('light');
    }
  }
  SifrrDom.register(SifrrShimmer);

  class SifrrInclude extends SifrrDom.Element {
    static syncedAttrs() {
      return ['url', 'type'];
    }
    onConnect() {
      let preffix = '',
          suffix = '';
      if (this.type === 'js') {
        preffix = '<script>';
        suffix = '</script>';
      } else if (this.type === 'css') {
        preffix = '<style>';
        suffix = '</style>';
      }
      if (this.url) {
        fetch(this.url).then(r => r.text()).then(text => {
          this.innerHTML = preffix + text + suffix;
        });
      }
    }
  }
  SifrrDom.register(SifrrInclude);

  var css$7 = ":host {\n  display: block;\n  width: 100%; }\n\n#header, #container {\n  position: relative; }\n\n#header {\n  padding: 0 24px; }\n\n/* count and fs */\n#count {\n  position: absolute; }\n\n#count {\n  bottom: 6px;\n  left: 6px;\n  background: rgba(255, 255, 255, 0.7);\n  border-radius: 10px;\n  font-size: 14px;\n  padding: 4px 6px; }\n\n/* Arrows css */\n.arrow {\n  position: absolute;\n  z-index: 5;\n  top: 0;\n  bottom: 0; }\n\n.arrow > * {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  margin: -6px 5px;\n  top: 50%;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px;\n  filter: drop-shadow(-1px -1px 3px #000); }\n\n.arrow.l {\n  left: 0;\n  cursor: w-resize; }\n\n.arrow.l > * {\n  left: 0;\n  transform: rotate(135deg); }\n\n.arrow.r {\n  right: 0;\n  cursor: e-resize; }\n\n.arrow.r > * {\n  right: 0;\n  transform: rotate(-45deg); }\n\n/* slot elements css */\nslot[name=preview]::slotted(*) {\n  height: 64px;\n  opacity: 0.5; }\n\nslot[name=preview]::slotted(*.active) {\n  border: 1px solid white;\n  opacity: 1; }\n\nsifrr-tab-header {\n  height: 64px; }\n";

  function _templateObject$6() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<style media=\"screen\">\n  ${this.state.style || ''}\n</style>\n<div id=\"container\">\n  <sifrr-tab-container>\n    <slot name=\"content\"></slot>\n  </sifrr-tab-container>\n  <span id=\"count\"></span>\n</div>\n<div id=\"header\">\n  <div class=\"arrow l\">\n    <span></span>\n  </div>\n  <div class=\"arrow r\">\n    <span></span>\n  </div>\n  <sifrr-tab-header options='{ \"showUnderline\": false }'>\n    <slot name=\"preview\"></slot>\n  </sifrr-tab-header>\n</div>"], ["<style media=\"screen\">\n  ", "\n</style>\n<style media=\"screen\">\n  \\${this.state.style || ''}\n</style>\n<div id=\"container\">\n  <sifrr-tab-container>\n    <slot name=\"content\"></slot>\n  </sifrr-tab-container>\n  <span id=\"count\"></span>\n</div>\n<div id=\"header\">\n  <div class=\"arrow l\">\n    <span></span>\n  </div>\n  <div class=\"arrow r\">\n    <span></span>\n  </div>\n  <sifrr-tab-header options='{ \"showUnderline\": false }'>\n    <slot name=\"preview\"></slot>\n  </sifrr-tab-header>\n</div>"]);
    _templateObject$6 = function () {
      return data;
    };
    return data;
  }
  const template$7 = SifrrDom.template(_templateObject$6(), css$7);
  class SifrrCarousel extends SifrrDom.Element {
    static get template() {
      return template$7;
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
      SifrrDom.Event.addListener('click', this, (e, t) => {
        if (t.matches('.arrow.l') || t.matches('.arrow.l span')) this.container.prev();
        if (t.matches('.arrow.r') || t.matches('.arrow.r span')) this.container.next();
      });
      this.container._update = () => {
        this.$('#count').textContent = "".concat(this.container.active + 1, "/").concat(this.container.total);
      };
    }
  }
  SifrrCarousel.defaultState = {
    style: ''
  };
  SifrrDom.register(SifrrCarousel);

  window.LazyLoader = lazyloader;

  exports.LazyLoader = lazyloader;
  exports.SifrrCarousel = SifrrCarousel;
  exports.SifrrCodeEditor = SifrrCodeEditor;
  exports.SifrrInclude = SifrrInclude;
  exports.SifrrLazyPicture = SifrrLazyPicture;
  exports.SifrrLazzyImg = SifrrLazyImg;
  exports.SifrrProgressRound = SifrrProgressRound;
  exports.SifrrShimmer = SifrrShimmer;
  exports.SifrrShowcase = SifrrShowcase;
  exports.SifrrStater = SifrrStater;
  exports.SifrrTabContainer = SifrrTabContainer;
  exports.SifrrTabHeader = SifrrTabHeader;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrr.elements.js.map
