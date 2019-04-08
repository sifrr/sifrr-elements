import SifrrDom from '@sifrr/dom'
import SifrrTabs from '../../sifrr-tabs/src/sifrrtabs'
import style from './style.scss'

const template = Sifrr.Dom.template`<style>
  ${style}
</style>
<div id="showHide" $click={{this.showHide}}></div>
<sifrr-tabs options='{"tabHeight": "calc(100vh - 132px)"}' data-sifrr-html="true">
  {{ this.headingHtml() }}
  {{ this.stateHtml() }}
</sifrr-tabs>
<footer>
  <input $keyup={{this.addTargetOnEnter}} id="addTargetInput" type="text" name="addTargetInput" value="" placeholder="Enter css selector query of target">
  <button $click={{this.addTarget}} class="btn3" type="button" name="addTargetButton">Add Taget</button>
  <button $click={{this.commitAll}} class="btn3" type="button" name="commitAll">Commit All</button>
  <button $click={{this.resetAllToFirstState}} class="btn3" type="button" name="resetAll">Reset All</button>
  <button $click={{this.saveData}} class="btn3" type="button" name="saveData">Save Data</button>
  <button $click={{this.loadData}} class="btn3" type="button" name="loadData">Load Data</button>
  <button $click={{this.clearAll}} class="btn3" type="button" name="clearAll">Remove All</button>
</footer>`;

Sifrr.Dom.Event.add('click');
Sifrr.Dom.Event.add('keyup');
class SifrrStater extends Sifrr.Dom.Element {
  static get template() {
    return template;
  }

  onConnect() {
    let me = this;
    this.storage = new Sifrr.Storage({
      name: window.location.href
    });
    Sifrr.Dom.Event.addListener('click', '.state', function(e, el) {
      el.classList.contains('open') ? el.classList.remove('open') : el.classList.add('open');
    });
    Sifrr.Dom.Event.addListener('click', '.dotC', function(e, target, el) {
      me.toState(parseInt(el.dataset.target), parseInt(el.dataset.stateIndex));
    });
    Sifrr.Dom.Event.addListener('click', '.delete', function(e, el) {
      me.deleteState(parseInt(el.dataset.target), parseInt(el.dataset.stateIndex));
    });
    Sifrr.Dom.Event.addListener('click', '.commit', function(e, el) {
      const i = parseInt(el.parentNode.dataset.target);
      me.commit(i);
    });
    Sifrr.Dom.Event.addListener('click', '.reset', function(e, el) {
      const i = parseInt(el.parentNode.dataset.target);
      me.resetToFirstState(i);
    });
    Sifrr.Dom.Event.addListener('click', '.remove', function(e, el) {
      const i = parseInt(el.parentNode.dataset.target);
      me.removeTarget(i);
    });
    Sifrr.Dom.Element.onStateChange = function(target) {
      me.addState(target, target.state);
    }
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
    return this.state.queries.map((q) => `<li slot="heading">${q}</li>`).join('');
  }

  stateHtml() {
    let me = this;
    return this.state.states.map((s, i) =>
      `<div data-target="${i}" slot="tab">
      <button class="btn3 commit" type="button" name="commit">Commit</button>
      <button class="btn3 reset" type="button" name="reset">Reset</button>
      <button class="btn3 remove" type="button" name="remove">Remove</button>
      ${s.map((jsn, j) => `<div class="stateContainer ${j <= me.state.activeStates[i] ? 'on' : 'off'}">
                           <div class="dotC" data-target="${i}" data-state-index="${j}"><div class="dot"></div></div>
                           <div class="state">${SifrrStater.prettyJSON(jsn)}</div>
                           <div class="delete" data-target="${i}" data-state-index="${j}">X</div>
                           </div>`).join('')}</div>`
    ).join('');
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
        }
        me.storage.insert(q, data);
      });
    });
  }

  loadData() {
    const me = this;
    this.storage.data().then((data) => {
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
      target = this.state.targets[index]
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
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
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
}

if (window) SifrrDom.register(SifrrStater, { extends: 'picture' });

export default SifrrStater;
