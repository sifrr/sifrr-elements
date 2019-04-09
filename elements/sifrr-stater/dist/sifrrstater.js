/*! SifrrStater v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom'), require('@sifrr/storage')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom', '@sifrr/storage'], factory) :
  (global = global || self, global.SifrrStater = factory(global.Sifrr.Dom, global.Sifrr.Storage));
}(this, function (SifrrDom, SifrrStorage) { 'use strict';

  SifrrDom = SifrrDom && SifrrDom.hasOwnProperty('default') ? SifrrDom['default'] : SifrrDom;
  SifrrStorage = SifrrStorage && SifrrStorage.hasOwnProperty('default') ? SifrrStorage['default'] : SifrrStorage;

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

  var css = ":host {\n  /* CSS for tabs container */\n  line-height: 24px;\n  overflow: hidden;\n  width: 100%;\n  display: block;\n  position: relative;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 5px; }\n\n.headings {\n  /* CSS for heading bar */\n  width: 100%;\n  overflow-y: hidden;\n  overflow-x: auto;\n  position: relative;\n  background: #714cfe;\n  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2); }\n\n.headings ul {\n  padding: 0 0 3px;\n  margin: 0;\n  font-size: 0; }\n\n/* CSS for heading text li */\n.headings *::slotted(li) {\n  font-size: 16px;\n  display: inline-block;\n  text-align: center;\n  padding: 8px;\n  text-decoration: none;\n  list-style: none;\n  color: white;\n  border-bottom: 2px solid transparent;\n  opacity: 0.9;\n  cursor: pointer;\n  box-sizing: border-box; }\n\n.headings *::slotted(li.active) {\n  opacity: 1; }\n\n.headings *::slotted(li:hover) {\n  opacity: 1; }\n\n/* CSS for line under active tab heading */\n.headings .underline {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  height: 3px;\n  background: white; }\n\n/* Arrows css */\n.arrow {\n  position: absolute;\n  z-index: 5;\n  top: 0;\n  bottom: 0;\n  width: 20px; }\n\n.arrow > * {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  margin: -6px 5px;\n  top: 50%;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px;\n  filter: drop-shadow(-1px -1px 3px #000); }\n\n.arrow.l {\n  left: 0; }\n\n.arrow.l > * {\n  left: 0;\n  transform: rotate(135deg); }\n\n.arrow.r {\n  right: 0; }\n\n.arrow.r > * {\n  right: 0;\n  transform: rotate(-45deg); }\n\n/* Tab container css */\n.content {\n  width: 100%;\n  height: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  margin: 0;\n  line-height: normal;\n  box-sizing: border-box; }\n\n.content .tabs {\n  min-height: 1px; }\n\n/* Tab element css */\n.content *::slotted([slot=\"tab\"]) {\n  float: left;\n  max-height: 100%;\n  width: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  vertical-align: top;\n  padding: 8px;\n  box-sizing: border-box; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<div class=\"headings\">\n  <ul>\n    <slot name=\"heading\">\n    </slot>\n  </ul>\n  <div class=\"underline\"></div>\n</div>\n<div class=\"content\">\n  <div class=\"arrow l\">\n    <span></span>\n  </div>\n  <div class=\"arrow r\">\n    <span></span>\n  </div>\n  <div class=\"tabs\">\n    <slot name=\"tab\">\n    </slot>\n  </div>\n</div>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const template = SifrrDom.template(_templateObject(), css);
  function removeExceptOne(elems, classN, index) {
    for (let j = 0; j < elems.length; j++) {
      j !== index && elems[j] !== index ? elems[j].classList.remove(classN) : elems[j].classList.add(classN);
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
      this._options = {
        menu: this.$(".headings ul"),
        content: this.$(".content"),
        tabcontainer: this.$(".tabs"),
        menus: this.$('slot[name=heading]').assignedNodes(),
        tabs: this.$('slot[name=tab]').assignedNodes(),
        la: this.$(".arrow.l"),
        ra: this.$(".arrow.r"),
        line: this.$(".underline"),
        num: 1,
        showArrows: false,
        arrowMargin: 0,
        showMenu: true,
        step: 1,
        tabHeight: 'auto',
        showUnderline: true,
        loop: false,
        animation: 'easeOut',
        animationTime: 300,
        scrollBreakpoint: 0.2
      };
      this._attrOptions = {};
      this.animations = this.animations();
      this.refresh();
      this.setWindowResizeEvent();
      this.setClickEvents();
      this.setSlotChangeEvent();
      this._connected = true;
    }
    onAttributeChange(n, _, v) {
      if (n === 'options') {
        this._attrOptions = JSON.parse(v || '{}');
        if (this._connected) this.refresh();
      }
    }
    refresh() {
      this.options = Object.assign({}, this._options, this._attrOptions);
      if (!this.options.tabs || this.options.tabs.length < 1) return;
      this.width = this.clientWidth / this.options.num;
      this.margin = 0;
      if (this.options.showArrows) {
        this.width -= 2 * this.options.arrowMargin;
        this.margin = this.options.arrowMargin;
      }
      this.setProps();
      this.active = this.active || 0;
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
      if (i + this.options.num - 1 == this.options.tabs.length) {
        if (this.options.loop) i = 0;else i = this.options.tabs.length - this.options.num;
      }
      if (!isNaN(i) && i !== this.state.active) {
        this.state.active = i;
        return;
      }
      this.animate(this.options.content, 'scrollLeft', i * (this.width + 2 * this.margin), this.options.animationTime, this.options.animation);
      removeExceptOne(this.options.tabs, 'active', i);
      removeExceptOne(this.options.tabs, 'prev', this.getTabNumber(i - 1));
      removeExceptOne(this.options.tabs, 'next', this.getTabNumber(i + 1));
      removeExceptOne(this.options.menus, 'active', i);
      removeExceptOne(this.options.menus, 'prev', this.getTabNumber(i - 1));
      removeExceptOne(this.options.menus, 'next', this.getTabNumber(i + 1));
      if (this.options.showArrows) {
        this.options.la.style.display = this.hasPrev() || this.options.loop ? "block" : "none";
        this.options.ra.style.display = this.hasNext() || this.options.loop ? "block" : "none";
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
      i = i < 0 ? i + l : i % l;
      return i;
    }
    setProps() {
      if (!this.options.showArrows) {
        if (this.options.la) this.options.la.style.display = 'none';
        if (this.options.ra) this.options.ra.style.display = 'none';
      } else {
        Array.from(this.options.tabs).forEach(e => e.style.margin = "0 ".concat(this.margin, "px"));
      }
      if (!this.options.showUnderline) {
        if (this.options.line) this.options.line.style.display = 'none';
      }
      if (this.options.showMenu) {
        this.setMenuProps();
        this.options.line.style.width = this.options.menus[0].offsetWidth + 'px';
      } else {
        if (this.options.menu) this.options.menu.style.display = 'none';
      }
      this.setScrollEvent();
      this.options.tabcontainer.style.width = this.options.tabs.length * (this.width + 2 * this.margin) + 'px';
      this.options.tabcontainer.style.height = this.options.tabHeight;
      Array.from(this.options.tabs).forEach(e => e.style.width = this.width + 'px');
    }
    setMenuProps() {
      const me = this;
      let left = 0;
      this.options.menuProps = [];
      Array.from(this.options.menus).forEach((elem, i) => {
        this.options.menuProps[i] = {
          width: elem.offsetWidth,
          left: left
        };
        left += elem.offsetWidth;
        elem._click = () => me.active = i;
      });
      const last = this.options.menuProps[this.options.menus.length - 1];
      this.options.menu.style.width = last.left + last.width + 5 + 'px';
      const active = this.options.menuProps[this.active];
      if (active) {
        me.options.line.style.left = active.left + 'px';
        me.options.line.style.width = active.width + 'px';
      }
    }
    setClickEvents() {
      let me = this;
      if (this.options.la) this.options.la._click = () => me.prev();
      if (this.options.ra) this.options.ra._click = () => me.next();
    }
    setScrollEvent() {
      let me = this,
          isScrolling,
          scrollPos = -1;
      me.options.content.onscroll = () => requestAnimationFrame(onScroll);
      function onScroll() {
        const total = me.options.content.scrollLeft / me.width;
        const per = total % 1;
        if (scrollPos < 0) scrollPos = per;
        const t = Math.floor(total);
        try {
          const left = me.options.menuProps[t].left * (1 - per) + (me.options.menuProps[t + 1] || {
            left: 0
          }).left * per;
          const width = me.options.menuProps[t].width * (1 - per) + (me.options.menuProps[t + 1] || {
            width: 0
          }).width * per;
          me.options.line.style.left = left + 'px';
          me.options.line.style.width = width + 'px';
          me.options.menu.parentElement.scrollLeft = left - (me.width - width) / 2;
        } catch (e) {}
        clearTimeout(isScrolling);
        isScrolling = setTimeout(function () {
          if (per - scrollPos < -me.options.scrollBreakpoint) {
            me.active = t;
          } else if (per - scrollPos > +me.options.scrollBreakpoint) {
            me.active = t + 1;
          } else {
            me.active = me.active;
          }
          scrollPos = -1;
        }, 66);
      }
    }
    setWindowResizeEvent() {
      const me = this;
      window.addEventListener("resize", function () {
        me.refresh();
      });
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
    animate(who, what, to, time, type = 'easeOut') {
      const from = who[what];
      const diff = to - from;
      const me = this;
      let startTime;
      function frame(currentTime) {
        startTime = startTime || currentTime;
        if (currentTime - startTime > time) {
          who[what] = to;
          return;
        }
        let percent = (currentTime - startTime) / time;
        who[what] = Math.round(me.animations[type].call(this, percent) * diff + from);
        window.requestAnimationFrame(frame);
      }
      window.requestAnimationFrame(frame);
    }
    animations() {
      return {
        linear: i => i,
        easeOut: i => --i * i * i + 1,
        easeIn: i => i * i * i,
        none: i => 1
      };
    }
  }
  if (window) SifrrDom.register(SifrrTabs);

  var css$1 = ":host {\n  position: fixed;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  max-width: 100%;\n  width: 320px;\n  z-index: 1000;\n  background-color: rgba(0, 0, 0, 0.8);\n  transform: translate3d(100%, 0, 0);\n  transition: all 0.2s ease; }\n\n:host(.show) {\n  transform: translate3d(0, 0, 0); }\n\n* {\n  box-sizing: border-box; }\n\n#showHide {\n  position: fixed;\n  left: -30px;\n  top: 0;\n  bottom: 0;\n  width: 30px;\n  height: 30px;\n  margin-top: 5px;\n  background-color: blue;\n  z-index: 2; }\n\n.stateContainer {\n  padding-left: 10px;\n  margin-left: 10px;\n  border-left: 1px solid white;\n  position: relative; }\n\n.stateContainer.off {\n  opacity: 0.5; }\n\n.stateContainer .dotC {\n  position: absolute;\n  top: 0;\n  left: -10px;\n  width: 20px;\n  height: 100%;\n  cursor: pointer; }\n\n.stateContainer .dotC .dot {\n  position: absolute;\n  top: 50%;\n  left: 10px;\n  width: 10px;\n  height: 10px;\n  transform: translate3d(-50%, -50%, 0);\n  background-color: white;\n  border-radius: 50%; }\n\n.stateContainer .delete {\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 4px;\n  background-color: rgba(0, 0, 0, 0.7);\n  color: white;\n  cursor: pointer; }\n\n.state {\n  white-space: pre-wrap;\n  max-height: 90px;\n  overflow: hidden;\n  background-color: rgba(255, 255, 255, 0.97);\n  padding: 5px;\n  margin-bottom: 5px;\n  position: relative;\n  cursor: pointer; }\n\n.state:hover::after {\n  content: '\\\\\\/';\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 0, 0.7);\n  text-align: center;\n  color: white; }\n\n.state.open {\n  max-height: none; }\n\n.state.open:hover::after {\n  content: '\\/\\\\'; }\n\n.key {\n  color: red; }\n\n.string {\n  color: green; }\n\n.number, .null, .boolean {\n  color: blue; }\n\nfooter {\n  position: absolute;\n  bottom: 0; }\n\ninput {\n  margin: 3px;\n  width: calc(100% - 6px);\n  padding: 3px; }\n\n.btn3 {\n  margin: 3px;\n  width: calc(33% - 8px);\n  padding: 3px;\n  background: white; }\n";

  function _templateObject$1() {
    const data = _taggedTemplateLiteral(["<style>\n  ", "\n</style>\n<div id=\"showHide\" _click=${this.showHide}></div>\n<sifrr-tabs options='{\"tabHeight\": \"calc(100vh - 132px)\"}' data-sifrr-html=\"true\">\n  ${ this.headingHtml() }\n  ${ this.stateHtml() }\n</sifrr-tabs>\n<footer>\n  <input _keyup=${this.addTargetOnEnter} id=\"addTargetInput\" type=\"text\" name=\"addTargetInput\" value=\"\" placeholder=\"Enter css selector query of target\">\n  <button _click=${this.addTarget} class=\"btn3\" type=\"button\" name=\"addTargetButton\">Add Taget</button>\n  <button _click=${this.commitAll} class=\"btn3\" type=\"button\" name=\"commitAll\">Commit All</button>\n  <button _click=${this.resetAllToFirstState} class=\"btn3\" type=\"button\" name=\"resetAll\">Reset All</button>\n  <button _click=${this.saveData} class=\"btn3\" type=\"button\" name=\"saveData\">Save Data</button>\n  <button _click=${this.loadData} class=\"btn3\" type=\"button\" name=\"loadData\">Load Data</button>\n  <button _click=${this.clearAll} class=\"btn3\" type=\"button\" name=\"clearAll\">Remove All</button>\n</footer>"], ["<style>\n  ", "\n</style>\n<div id=\"showHide\" _click=\\${this.showHide}></div>\n<sifrr-tabs options='{\"tabHeight\": \"calc(100vh - 132px)\"}' data-sifrr-html=\"true\">\n  \\${ this.headingHtml() }\n  \\${ this.stateHtml() }\n</sifrr-tabs>\n<footer>\n  <input _keyup=\\${this.addTargetOnEnter} id=\"addTargetInput\" type=\"text\" name=\"addTargetInput\" value=\"\" placeholder=\"Enter css selector query of target\">\n  <button _click=\\${this.addTarget} class=\"btn3\" type=\"button\" name=\"addTargetButton\">Add Taget</button>\n  <button _click=\\${this.commitAll} class=\"btn3\" type=\"button\" name=\"commitAll\">Commit All</button>\n  <button _click=\\${this.resetAllToFirstState} class=\"btn3\" type=\"button\" name=\"resetAll\">Reset All</button>\n  <button _click=\\${this.saveData} class=\"btn3\" type=\"button\" name=\"saveData\">Save Data</button>\n  <button _click=\\${this.loadData} class=\"btn3\" type=\"button\" name=\"loadData\">Load Data</button>\n  <button _click=\\${this.clearAll} class=\"btn3\" type=\"button\" name=\"clearAll\">Remove All</button>\n</footer>"]);
    _templateObject$1 = function () {
      return data;
    };
    return data;
  }
  const template$1 = SifrrDom.template(_templateObject$1(), css$1);
  SifrrDom.Event.add('click');
  SifrrDom.Event.add('keyup');
  class SifrrStater extends SifrrDom.Element {
    static get template() {
      return template$1;
    }
    onConnect() {
      let me = this;
      this.storage = new SifrrStorage({
        name: window.location.href
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
      SifrrDom.Element.onStateChange = function (target) {
        me.addState(target, target.state);
      };
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
      return this.state.queries.map(q => "<li slot=\"heading\">".concat(q, "</li>")).join('');
    }
    stateHtml() {
      let me = this;
      return this.state.states.map((s, i) => "<div data-target=\"".concat(i, "\" slot=\"tab\">\n      <button class=\"btn3 commit\" type=\"button\" name=\"commit\">Commit</button>\n      <button class=\"btn3 reset\" type=\"button\" name=\"reset\">Reset</button>\n      <button class=\"btn3 remove\" type=\"button\" name=\"remove\">Remove</button>\n      ").concat(s.map((jsn, j) => "<div class=\"stateContainer ".concat(j <= me.state.activeStates[i] ? 'on' : 'off', "\">\n                           <div class=\"dotC\" data-target=\"").concat(i, "\" data-state-index=\"").concat(j, "\"><div class=\"dot\"></div></div>\n                           <div class=\"state\">").concat(SifrrStater.prettyJSON(jsn), "</div>\n                           <div class=\"delete\" data-target=\"").concat(i, "\" data-state-index=\"").concat(j, "\">X</div>\n                           </div>")).join(''), "</div>")).join('');
    }
    addTarget(query) {
      if (typeof query !== 'string') query = this.$('#addTargetInput').value;
      const target = window.document.querySelector(query);
      if (!target.isSifrr) {
        console.log("Invalid Sifrr Element.", target);
        return false;
      }
      if (!target.state) {
        console.log("Sifrr Element has no state.", target);
        return false;
      }
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
        index,
        target
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
        index,
        target
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
        index,
        target
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
        index,
        target
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
      const active = this.state.activeStates[index];
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
          me.storage.insert(q, data);
        });
      });
    }
    loadData() {
      const me = this;
      this.storage.data().then(data => {
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
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
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
  if (window) SifrrDom.register(SifrrStater);

  return SifrrStater;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrstater.js.map
