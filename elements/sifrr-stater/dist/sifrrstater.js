/*! SifrrStater v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr */
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

  var css = ":host {\n  position: fixed;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  max-width: 100%;\n  width: 320px;\n  z-index: 1000;\n  background-color: rgba(0, 0, 0, 0.8);\n  transform: translate3d(100%, 0, 0);\n  transition: all 0.2s ease; }\n\n:host(.show) {\n  transform: translate3d(0, 0, 0); }\n\n* {\n  box-sizing: border-box; }\n\n#showHide {\n  position: fixed;\n  left: -30px;\n  top: 0;\n  bottom: 0;\n  width: 30px;\n  height: 30px;\n  margin-top: 5px;\n  background-color: blue;\n  z-index: 2; }\n\n.stateContainer {\n  padding-left: 10px;\n  margin-left: 10px;\n  border-left: 1px solid white;\n  position: relative; }\n\n.stateContainer.off {\n  opacity: 0.5; }\n\n.stateContainer .dotC {\n  position: absolute;\n  top: 0;\n  left: -10px;\n  width: 20px;\n  height: 100%;\n  cursor: pointer; }\n\n.stateContainer .dotC .dot {\n  position: absolute;\n  top: 50%;\n  left: 10px;\n  width: 10px;\n  height: 10px;\n  transform: translate3d(-50%, -50%, 0);\n  background-color: white;\n  border-radius: 50%; }\n\n.stateContainer .delete {\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 4px;\n  background-color: rgba(0, 0, 0, 0.7);\n  color: white;\n  cursor: pointer; }\n\n.state {\n  white-space: pre-wrap;\n  max-height: 90px;\n  overflow: hidden;\n  background-color: rgba(255, 255, 255, 0.97);\n  padding: 5px;\n  margin-bottom: 5px;\n  position: relative;\n  cursor: pointer; }\n\n.state:hover::after {\n  content: '\\\\\\/';\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 0, 0.7);\n  text-align: center;\n  color: white; }\n\n.state.open {\n  max-height: none; }\n\n.state.open:hover::after {\n  content: '\\/\\\\'; }\n\n.key {\n  color: red; }\n\n.string {\n  color: green; }\n\n.number, .null, .boolean {\n  color: blue; }\n\nfooter {\n  position: absolute;\n  bottom: 0; }\n\ninput {\n  margin: 3px;\n  width: calc(100% - 6px);\n  padding: 3px; }\n\n.btn3 {\n  margin: 3px;\n  width: calc(33% - 8px);\n  padding: 3px;\n  background: white; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["<style>\n  ", "\n</style>\n<div id=\"showHide\" _click=${this.showHide}></div>\n<sifrr-tabs options='{\"tabHeight\": \"calc(100vh - 132px)\"}' data-sifrr-html=\"true\">\n  ${ this.headingHtml() }\n  ${ this.stateHtml() }\n</sifrr-tabs>\n<footer>\n  <input _keyup=${this.addTargetOnEnter} id=\"addTargetInput\" type=\"text\" name=\"addTargetInput\" value=\"\" placeholder=\"Enter css selector query of target\">\n  <button _click=${this.addTarget} class=\"btn3\" type=\"button\" name=\"addTargetButton\">Add Taget</button>\n  <button _click=${this.commitAll} class=\"btn3\" type=\"button\" name=\"commitAll\">Commit All</button>\n  <button _click=${this.resetAllToFirstState} class=\"btn3\" type=\"button\" name=\"resetAll\">Reset All</button>\n  <button _click=${this.saveData} class=\"btn3\" type=\"button\" name=\"saveData\">Save Data</button>\n  <button _click=${this.loadData} class=\"btn3\" type=\"button\" name=\"loadData\">Load Data</button>\n  <button _click=${this.clearAll} class=\"btn3\" type=\"button\" name=\"clearAll\">Remove All</button>\n</footer>"], ["<style>\n  ", "\n</style>\n<div id=\"showHide\" _click=\\${this.showHide}></div>\n<sifrr-tabs options='{\"tabHeight\": \"calc(100vh - 132px)\"}' data-sifrr-html=\"true\">\n  \\${ this.headingHtml() }\n  \\${ this.stateHtml() }\n</sifrr-tabs>\n<footer>\n  <input _keyup=\\${this.addTargetOnEnter} id=\"addTargetInput\" type=\"text\" name=\"addTargetInput\" value=\"\" placeholder=\"Enter css selector query of target\">\n  <button _click=\\${this.addTarget} class=\"btn3\" type=\"button\" name=\"addTargetButton\">Add Taget</button>\n  <button _click=\\${this.commitAll} class=\"btn3\" type=\"button\" name=\"commitAll\">Commit All</button>\n  <button _click=\\${this.resetAllToFirstState} class=\"btn3\" type=\"button\" name=\"resetAll\">Reset All</button>\n  <button _click=\\${this.saveData} class=\"btn3\" type=\"button\" name=\"saveData\">Save Data</button>\n  <button _click=\\${this.loadData} class=\"btn3\" type=\"button\" name=\"loadData\">Load Data</button>\n  <button _click=\\${this.clearAll} class=\"btn3\" type=\"button\" name=\"clearAll\">Remove All</button>\n</footer>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const template = SifrrDom.template(_templateObject(), css);
  SifrrDom.Event.add('click');
  SifrrDom.Event.add('keyup');
  class SifrrStater extends SifrrDom.Element {
    static get template() {
      return template;
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
