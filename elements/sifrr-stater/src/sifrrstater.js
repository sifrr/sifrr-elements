import { html, createTemplateFromString } from '@sifrr/template';
import { Element, register, Event } from '@sifrr/dom';
import SifrrStorage from '@sifrr/storage';
import '../../sifrr-tab-header/src/sifrrtabheader';
import '../../sifrr-tab-container/src/sifrrtabcontainer';
import style from './style.scss';
import States from './states';

const template = html`
  <style>
    ${style}
  </style>
  <div id="showHide" :_click="${el => el.showHide.bind(el)}"></div>
  <sifrr-tab-header style="background: blue; color: white" :sifrr-html="true">
    ${el => createTemplateFromString(el.headingHtml()).content.childNodes}
  </sifrr-tab-header>
  <sifrr-tab-container style="height: calc(100vh - 132px)" :sifrr-html="true">
    ${(el, oldV) =>
      el.state.states.map((states, i) =>
        States({ states, index: i, activeState: el.state.activeStates[i] }, oldV[i])
      )}
  </sifrr-tab-container>
  <footer>
    <input
      :_keyup="${el => el.addTargetOnEnter.bind(el)}"
      id="addTargetInput"
      type="text"
      name="addTargetInput"
      value=""
      placeholder="Enter css selector query of target"
    />
    <button
      :_click="${el => el.addTarget.bind(el)}"
      class="btn3"
      type="button"
      name="addTargetButton"
    >
      Add Taget
    </button>
    <button :_click="${el => el.commitAll.bind(el)}" class="btn3" type="button" name="commitAll">
      Commit All
    </button>
    <button
      :_click="${el => el.resetAllToFirstState.bind(el)}"
      class="btn3"
      type="button"
      name="resetAll"
    >
      Reset All
    </button>
    <button :_click="${el => el.saveData.bind(el)}" class="btn3" type="button" name="saveData">
      Save Data
    </button>
    <button :_click="${el => el.loadData.bind(el)}" class="btn3" type="button" name="loadData">
      Load Data
    </button>
    <button :_click="${el => el.clearAll.bind(el)}" class="btn3" type="button" name="clearAll">
      Remove All
    </button>
  </footer>
`;

Event.add('click');
Event.add('keyup');
class SifrrStater extends Element {
  static get template() {
    return template;
  }

  constructor() {
    super();
    this.state = {
      targets: [],
      states: [],
      queries: [],
      activeStates: []
    };
  }

  onConnect() {
    let me = this;
    Event.addListener('click', '.state', function(e, el) {
      el.classList.contains('open') ? el.classList.remove('open') : el.classList.add('open');
    });
    Event.addListener('click', '.dotC', function(e, target, el) {
      me.toState(parseInt(el.dataset.target), parseInt(el.dataset.stateIndex));
    });
    Event.addListener('click', '.delete', function(e, el) {
      me.deleteState(parseInt(el.dataset.target), parseInt(el.dataset.stateIndex));
    });
    Event.addListener('click', '.commit', function(e, el) {
      const i = parseInt(el.parentNode.dataset.target);
      me.commit(i);
    });
    Event.addListener('click', '.reset', function(e, el) {
      const i = parseInt(el.parentNode.dataset.target);
      me.resetToFirstState(i);
    });
    Event.addListener('click', '.remove', function(e, el) {
      const i = parseInt(el.parentNode.dataset.target);
      me.removeTarget(i);
    });
    this.storage = new SifrrStorage({
      name: 'sifrr-stater' + window.location.href
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
    return this.state.queries.map(q => `<span>${q}</span>`).join('');
  }

  addTarget(query) {
    if (typeof query !== 'string') query = this.$('#addTargetInput').value;
    let target = window.document.querySelector(query);
    if (!target || !target.isSifrr) {
      window.console.log('Invalid Sifrr Element.', target);
      return false;
    }
    if (!target.state) {
      window.console.log('Sifrr Element has no state.', target);
      return false;
    }
    const old = target.onStateChange,
      me = this;
    target.onStateChange = function() {
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
    const { index } = this.getTarget(el);
    if (index > -1) {
      this.state.targets.splice(index, 1);
      this.state.queries.splice(index, 1);
      this.state.states.splice(index, 1);
      this.state.activeStates.splice(index, 1);
      this.update();
    }
  }

  addState(el, state) {
    const { index } = this.getTarget(el);
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
    const { index } = this.getTarget(el);
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
    const { index } = this.getTarget(el);
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
    const { index, target } = this.getTarget(el);
    this.state.activeStates[index] = n;
    target.setState(this.state.states[index][n]);
    this.update();
  }

  resetToFirstState(el) {
    const { index, target } = this.getTarget(el);
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
    const { index } = this.getTarget(target);
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
}

register(SifrrStater);

export default SifrrStater;
