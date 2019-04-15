/*! SifrrElements v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';
import SifrrStorage from '@sifrr/storage';

function moveAttr(el, attr) {
  if (!el.dataset[attr]) return;
  el.setAttribute(attr, el.dataset[attr]);
  el.removeAttribute(`data-${attr}`);
}
function loadPicture(img) {
  if (img._loaded) return;
  img._loaded = true;
  SifrrLazyImg.observer.unobserve(img);
  img.beforeLoad();
  moveAttr(img, 'src');
  moveAttr(img, 'srcset');
  img.afterLoad();
  return true;
}
class SifrrLazyImg extends Sifrr.Dom.Element.extends(HTMLImageElement) {
  static get observer() {
    this._observer = this._observer || new IntersectionObserver(this.onVisible, {
      rootMargin: this.rootMargin
    });
    return this._observer;
  }
  static onVisible(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadPicture(entry.target);
        this.unobserve(entry.target);
      }
    });
  }
  onConnect() {
    this.reload();
  }
  reload() {
    this._loaded = false;
    this.constructor.observer.observe(this);
  }
  beforeLoad() {}
  afterLoad() {}
  onDisconnect() {
    this.constructor.observer.unobserve(this);
  }
}
SifrrLazyImg.rootMargin = '0px 0px 200px 0px';
SifrrDom.register(SifrrLazyImg, { extends: 'img' });

function moveAttr$1(el, attr) {
  if (!el.dataset[attr]) return;
  el.setAttribute(attr, el.dataset[attr]);
  el.removeAttribute(`data-${attr}`);
}
function loadPicture$1(pic) {
  if (pic._loaded) return;
  pic._loaded = true;
  SifrrLazyPicture.observer.unobserve(pic);
  pic.beforeLoad();
  pic.$$('source', false).forEach((s) => {
    moveAttr$1(s, 'srcset');
  });
  const img = pic.$('img', false);
  moveAttr$1(img, 'src');
  moveAttr$1(img, 'srcset');
  pic.afterLoad();
  return true;
}
class SifrrLazyPicture extends Sifrr.Dom.Element.extends(HTMLPictureElement) {
  static get observer() {
    this._observer = this._observer || new IntersectionObserver(this.onVisible, {
      rootMargin: this.rootMargin
    });
    return this._observer;
  }
  static onVisible(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadPicture$1(entry.target);
        this.unobserve(entry.target);
      }
    });
  }
  onConnect() {
    this.reload();
  }
  reload() {
    this._loaded = false;
    this.constructor.observer.observe(this);
  }
  beforeLoad() {}
  afterLoad() {}
  onDisconnect() {
    this.constructor.observer.unobserve(this);
  }
}
SifrrLazyPicture.rootMargin = '0px 0px 200px 0px';
SifrrDom.register(SifrrLazyPicture, { extends: 'picture' });

var css = ":host {\n  /* CSS for tabs container */\n  line-height: 24px;\n  overflow: hidden;\n  width: 100%;\n  display: block;\n  position: relative; }\n\n.headings {\n  /* CSS for heading bar */\n  width: 100%;\n  overflow-y: hidden;\n  overflow-x: auto;\n  position: relative;\n  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2); }\n\n.headings ul {\n  padding: 0 0 3px;\n  margin: 0;\n  font-size: 0; }\n\n/* CSS for heading text li */\n.headings *::slotted(li) {\n  font-size: 16px;\n  display: inline-block;\n  text-align: center;\n  padding: 8px;\n  text-decoration: none;\n  list-style: none;\n  color: white;\n  border-bottom: 2px solid transparent;\n  opacity: 0.9;\n  cursor: pointer;\n  box-sizing: border-box; }\n\n.headings *::slotted(li.active) {\n  opacity: 1; }\n\n.headings *::slotted(li:hover) {\n  opacity: 1; }\n\n/* CSS for line under active tab heading */\n.headings .underline {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  height: 3px;\n  background: white; }\n\n/* Arrows css */\n.arrow {\n  position: absolute;\n  z-index: 5;\n  top: 0;\n  bottom: 0; }\n\n.arrow > * {\n  position: absolute;\n  width: 8px;\n  height: 8px;\n  margin: -6px 5px;\n  top: 50%;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px;\n  filter: drop-shadow(-1px -1px 3px #000); }\n\n.arrow.l {\n  left: 0;\n  cursor: w-resize; }\n\n.arrow.l > * {\n  left: 0;\n  transform: rotate(135deg); }\n\n.arrow.r {\n  right: 0;\n  cursor: e-resize; }\n\n.arrow.r > * {\n  right: 0;\n  transform: rotate(-45deg); }\n\n/* Tab container css */\n.content {\n  width: 100%;\n  height: 100%;\n  overflow-x: auto;\n  overflow-y: hidden;\n  margin: 0;\n  line-height: normal;\n  box-sizing: border-box; }\n\n.content .tabs {\n  min-height: 1px; }\n\n/* Tab element css */\n.content *::slotted([slot=\"tab\"]) {\n  float: left;\n  max-height: 100%;\n  height: 100%;\n  overflow-x: hidden;\n  overflow-y: auto;\n  vertical-align: top;\n  padding: 8px;\n  box-sizing: border-box; }\n";

const animations = {
  linear: [0, 0, 1, 1],
  ease: [.25, .1, .25, 1],
  easeIn: [.42, 0, 1, 1],
  easeOut: [0, 0, .58, 1],
  easeInOut: [.42, 0, .58, 1]
};
class Bezier {
  constructor(args){
    this.setProps(...args);
    return this.final.bind(this);
  }
  setProps(x1, y1, x2, y2) {
    let props = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      A: (aA1, aA2) => 1.0 - 3.0 * aA2 + 3.0 * aA1,
      B: (aA1, aA2) => 3.0 * aA2 - 6.0 * aA1,
      C: (aA1) => 3.0 * aA1,
      CalcBezier: (aT, aA1, aA2) => ((this.A(aA1, aA2)*aT + this.B(aA1, aA2))*aT + this.C(aA1))*aT,
      GetSlope: (aT, aA1, aA2) => 3.0 * this.A(aA1, aA2)*aT*aT + 2.0 * this.B(aA1, aA2) * aT + this.C(aA1)
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
      if (slope == 0.0) return t;
      let x = this.CalcBezier(t, this.x1, this.x2) - xx;
      t -= x / slope;
    }
    return t;
  }
}
function animate(who, what, to, time = 300, { preffix = false, suffix = false, type = 'ease' } = {}) {
  let from = who[what].toString(), toBefore = to;
  to = to.toString();
  from = Number(from.slice(preffix ? preffix.length : 0, suffix ? -1 * suffix.length : from.length));
  to = Number(to.slice(preffix ? preffix.length : 0, suffix ? -1 * suffix.length : to.length));
  const diff = to - from;
  const animeFxn = new Bezier(animate.types[type] || type);
  let startTime;
  return new Promise(res => {
    function frame(currentTime) {
      startTime = startTime || currentTime;
      const percent = (currentTime - startTime) / time;
      if (percent >= 1) {
        who[what] = toBefore;
        return res();
      }
      let next = animeFxn(percent) * diff + from;
      if (!suffix && !preffix) who[what] = next;
      else who[what] = (preffix ? preffix : '') + next + (suffix ? suffix : '');
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  });
}
animate.types = animations;
var animate_1 = animate;

const template = SifrrDom.template`<style media="screen">
  ${css}
</style>
<style>
  .tabs {
    height: \${this.options ? this.options.tabHeight : 'auto'};
    width: \${this.totalWidth + 'px'};
  }
  .headings {
    display: \${this.headingDisplay};
    background: \${this.options ? this.options.background : 'transparent'};
  }
  .content *::slotted([slot="tab"]) {
    width: \${this.tabWidth + 'px'};
    margin: 0 \${this.options ? this.options.arrowMargin + 'px' : 0};
  }
  .arrow {
    width: \${this.options ? this.options.arrowWidth : '20px'};
  }
</style>
<div class="headings">
  <ul>
    <slot name="heading">
    </slot>
  </ul>
  <div class="underline"></div>
</div>
<div class="content">
  <div class="arrow l" _click=\${this.prev}>
    <span></span>
  </div>
  <div class="arrow r" _click=\${this.next}>
    <span></span>
  </div>
  <div class="tabs">
    <slot name="tab">
    </slot>
  </div>
</div>`;
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
      Array.from(this.options.tabs).forEach(e => e.style.margin = `0 ${this.margin}px`);
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
      isScrolling = setTimeout(function() {
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
    animate_1(this.options.content, 'scrollLeft', i * (this.tabWidth + 2 * this.options.arrowMargin), this.options.animationTime, { type: this.options.animation });
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
SifrrTabs.defaultState = { active: 0 };
SifrrDom.register(SifrrTabs);

var css$1 = ":host {\n  position: fixed;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 100%;\n  max-width: 100%;\n  width: 320px;\n  z-index: 1000;\n  background-color: rgba(0, 0, 0, 0.8);\n  transform: translate3d(100%, 0, 0);\n  transition: all 0.2s ease; }\n\n:host(.show) {\n  transform: translate3d(0, 0, 0); }\n\n* {\n  box-sizing: border-box; }\n\n#showHide {\n  position: fixed;\n  left: -30px;\n  top: 0;\n  bottom: 0;\n  width: 30px;\n  height: 30px;\n  margin-top: 5px;\n  background-color: blue;\n  z-index: 2; }\n\n.stateContainer {\n  padding-left: 10px;\n  margin-left: 10px;\n  border-left: 1px solid white;\n  position: relative; }\n\n.stateContainer.off {\n  opacity: 0.5; }\n\n.stateContainer .dotC {\n  position: absolute;\n  top: 0;\n  left: -10px;\n  width: 20px;\n  height: 100%;\n  cursor: pointer; }\n\n.stateContainer .dotC .dot {\n  position: absolute;\n  top: 50%;\n  left: 10px;\n  width: 10px;\n  height: 10px;\n  transform: translate3d(-50%, -50%, 0);\n  background-color: white;\n  border-radius: 50%; }\n\n.stateContainer .delete {\n  position: absolute;\n  top: 0;\n  right: 0;\n  padding: 4px;\n  background-color: rgba(0, 0, 0, 0.7);\n  color: white;\n  cursor: pointer; }\n\n.state {\n  white-space: pre-wrap;\n  max-height: 90px;\n  overflow: hidden;\n  background-color: rgba(255, 255, 255, 0.97);\n  padding: 5px;\n  margin-bottom: 5px;\n  position: relative;\n  cursor: pointer; }\n\n.state:hover::after {\n  content: '\\\\\\/';\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 0, 0.7);\n  text-align: center;\n  color: white; }\n\n.state.open {\n  max-height: none; }\n\n.state.open:hover::after {\n  content: '\\/\\\\'; }\n\n.key {\n  color: red; }\n\n.string {\n  color: green; }\n\n.number, .null, .boolean {\n  color: blue; }\n\nfooter {\n  position: absolute;\n  bottom: 0; }\n\ninput {\n  margin: 3px;\n  width: calc(100% - 6px);\n  padding: 3px; }\n\n.btn3 {\n  margin: 3px;\n  width: calc(33% - 8px);\n  padding: 3px;\n  background: white; }\n";

const template$1 = SifrrDom.template`<style>
  ${css$1}
</style>
<div id="showHide" _click=\${this.showHide}></div>
<sifrr-tabs options='{"tabHeight": "calc(100vh - 132px)"}' data-sifrr-html="true">
  \${ this.headingHtml() }
  \${ this.stateHtml() }
</sifrr-tabs>
<footer>
  <input _keyup=\${this.addTargetOnEnter} id="addTargetInput" type="text" name="addTargetInput" value="" placeholder="Enter css selector query of target">
  <button _click=\${this.addTarget} class="btn3" type="button" name="addTargetButton">Add Taget</button>
  <button _click=\${this.commitAll} class="btn3" type="button" name="commitAll">Commit All</button>
  <button _click=\${this.resetAllToFirstState} class="btn3" type="button" name="resetAll">Reset All</button>
  <button _click=\${this.saveData} class="btn3" type="button" name="saveData">Save Data</button>
  <button _click=\${this.loadData} class="btn3" type="button" name="loadData">Load Data</button>
  <button _click=\${this.clearAll} class="btn3" type="button" name="clearAll">Remove All</button>
</footer>`;
SifrrDom.Event.add('click');
SifrrDom.Event.add('keyup');
class SifrrStater extends SifrrDom.Element {
  static get template() {
    return template$1;
  }
  onConnect() {
    let me = this;
    this.storage = new SifrrStorage({
      name: 'sifrr-stater' + window.location.href
    });
    SifrrDom.Event.addListener('click', '.state', function(e, el) {
      el.classList.contains('open') ? el.classList.remove('open') : el.classList.add('open');
    });
    SifrrDom.Event.addListener('click', '.dotC', function(e, target, el) {
      me.toState(parseInt(el.dataset.target), parseInt(el.dataset.stateIndex));
    });
    SifrrDom.Event.addListener('click', '.delete', function(e, el) {
      me.deleteState(parseInt(el.dataset.target), parseInt(el.dataset.stateIndex));
    });
    SifrrDom.Event.addListener('click', '.commit', function(e, el) {
      const i = parseInt(el.parentNode.dataset.target);
      me.commit(i);
    });
    SifrrDom.Event.addListener('click', '.reset', function(e, el) {
      const i = parseInt(el.parentNode.dataset.target);
      me.resetToFirstState(i);
    });
    SifrrDom.Event.addListener('click', '.remove', function(e, el) {
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
    let target = window.document.querySelector(query);
    if (!target.isSifrr) {
      window.console.log('Invalid Sifrr Element.', target);
      return false;
    }
    if (!target.state) {
      window.console.log('Sifrr Element has no state.', target);
      return false;
    }
    const old = target.onStateChange, me = this;
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
    this.storage.all().then((data) => {
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
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function(match) {
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

var css$2 = "* {\n  box-sizing: border-box; }\n\n.font {\n  font-family: Roboto, Ariel; }\n\n.container {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-wrap: nowrap;\n  background-color: #3a3f5a; }\n\n#sidemenu {\n  width: 15%;\n  height: 100%; }\n\n#sidemenu > * {\n  height: 100%; }\n\nsifrr-single-showcase {\n  width: 85%;\n  height: 100%;\n  display: block; }\n\n#sidebar {\n  width: 30%;\n  height: 100%; }\n\n#sidebar > * {\n  height: 33.33%; }\n\n#main {\n  width: 70%;\n  height: 100%; }\n\n.current {\n  background: #5f616d; }\n\n.flex-column {\n  height: 100%;\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: column; }\n\n.box {\n  width: 100%;\n  overflow: scroll;\n  border: 1px solid #5f616d; }\n\n#element {\n  padding: 20px;\n  height: 70%; }\n\n#code {\n  height: 30%; }\n\n#code sifrr-code-editor {\n  height: calc(100% - 48px) !important; }\n\n.head {\n  color: #cccccc;\n  text-align: center; }\n\n.small {\n  color: #8f9cb3;\n  font-size: 16px;\n  line-height: 24px;\n  padding: 4px; }\n\n#error, #status {\n  color: red; }\n\nsifrr-code-editor {\n  height: calc(100% - 24px); }\n\nul {\n  padding: 8px;\n  margin: 0; }\n\n.variant, .showcase {\n  list-style-type: none; }\n  .variant span, .showcase span {\n    color: red;\n    float: right; }\n\n#saver, #loader {\n  color: green;\n  padding: 4px;\n  margin: 0; }\n\nbutton, .button {\n  position: relative;\n  display: inline-block;\n  background: #cccccc;\n  border: 1px solid grey;\n  color: #3a3f5a;\n  font-size: 14px;\n  padding: 4px; }\n  button input, .button input {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    opacity: 0; }\n";

const html = "<div class=\"container\">\n  <div class=\"flex-column\" id=\"sidebar\">\n    <div class=\"box\">\n      <h3 class=\"font head\">Variants</h3>\n      <input id=\"variantName\" type=\"text\" name=\"variantName\" value=\"${this.state.variantName}\" data-sifrr-bind=\"variantName\">\n      <button class=\"font\" type=\"button\" name=\"createVariant\" _click=\"${this.createNewVariant}\">Create new variant</button>\n      <style media=\"screen\">\n        #variant${this.state.variantId} {\n          background: #5f616d;\n        }\n      </style>\n      <div id=\"showcases\">\n        <div data-sifrr-repeat=\"${this.state.variants}\">\n          <li class=\"font variant small\" data-variant-id=\"${this.state.variantId}\" id=\"variant${this.state.variantId}\">${this.state.variantName}<span>X</span></li>\n        </div>\n      </div>\n    </div>\n    <div class=\"box\">\n      <label class=\"font small\" for=\"style\">Element CSS Styles</label>\n      <sifrr-code-editor lang=\"css\" data-sifrr-bind=\"style\" value=\"${this.state.style}\"></sifrr-code-editor>\n    </div>\n    <div class=\"box\">\n      <label class=\"font small\" for=\"elState\">Element State Function</label>\n      <sifrr-code-editor id=\"elState\" lang=\"js\" data-sifrr-bind=\"elState\" value=\"${this.state.elState}\"></sifrr-code-editor>\n    </div>\n  </div>\n  <div class=\"flex-column\" id=\"main\">\n    <div class=\"box\" id=\"element\" data-sifrr-html=\"true\">\n      ${this.state.code}\n    </div>\n    <div class=\"box\" id=\"code\">\n      <label class=\"font small\" for=\"elementName\">Element Name</label>\n      <input type=\"text\" name=\"elementName\" placeholder=\"Enter element name here...\" _input=\"${this.updateHtml}\" value=\"${this.state.element}\">\n      <label class=\"font small\" for=\"customUrl\">Custom Url</label>\n      <input type=\"text\" name=\"customUrl\" placeholder=\"Enter element url here...\" value=\"${this.state.elementUrl}\" data-sifrr-bind=\"elementUrl\">\n      <label class=\"font small\" for=\"elementName\">Is JS File</label>\n      <select id=\"isjs\" name=\"isjs\" value=\"${this.state.isjs}\" data-sifrr-bind=\"isjs\">\n        <option value=\"true\">true</option>\n        <option value=\"false\">false</option>\n      </select>\n      <span class=\"font\" id=\"error\"></span>\n      <br>\n      <label class=\"font small\" for=\"htmlcode\">HTML Code</label>\n      <sifrr-code-editor lang=\"html\" data-sifrr-bind=\"code\" value=\"${this.state.code}\"></sifrr-code-editor>\n    </div>\n  </div>\n</div>";

var css$3 = ":host {\n  display: block;\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\n.hljs {\n  width: 100%;\n  height: 100%;\n  font-family: Consolas,Liberation Mono,Courier,monospace;\n  font-size: 14px;\n  line-height: 18px;\n  padding: 8px;\n  margin: 0;\n  position: absolute;\n  white-space: pre-wrap;\n  top: 0;\n  left: 0; }\n\ntextarea {\n  z-index: 2;\n  resize: none;\n  border: none; }\n\ntextarea.loaded {\n  background: transparent !important;\n  text-shadow: 0px 0px 0px rgba(0, 0, 0, 0);\n  text-fill-color: transparent;\n  -webkit-text-fill-color: transparent; }\n\npre {\n  z-index: 1; }\n";

const template$2 = SifrrDom.template`
<style media="screen">
  ${css$3}
</style>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/\${this.theme}.min.css">
<pre class='hljs'>
  <code id="highlight" data-sifrr-html="true">
    \${this.htmlValue}
  </code>
</pre>
<textarea class='hljs' _input="\${this.input}"></textarea>`;
class SifrrCodeEditor extends SifrrDom.Element {
  static get template() {
    return template$2;
  }
  static observedAttrs() {
    return ['value', 'theme'];
  }
  static hljs() {
    this._hljs = this._hljs || fetch('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js')
      .then(resp => resp.text())
      .then(text => new Function(text)());
    return this._hljs;
  }
  onAttributeChange() {
    this.update();
  }
  onConnect() {
    this.constructor.hljs().then(() => this.hljsLoaded());
    const txtarea = this.$('textarea');
    txtarea.addEventListener('keydown', (e) => {
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
    if (window.hljs) return window.hljs.highlight(this.lang, this.value).value;
    else return this.value.replace(/</g, '&lt;');
  }
  get theme() {
    return this.getAttribute('theme') || 'atom-one-dark';
  }
  set theme(v) {
    this.setAttribute('theme', v);
    this.update();
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

const template$3 = SifrrDom.template`<style media="screen">
  ${css$2}
</style>
<style>
\${this.state.style}
</style>
${html}`;
SifrrDom.Event.add('click');
const defaultShowcase = {
  id: 1,
  name: 'Placeholder Element',
  element: 'sifrr-placeholder',
  elementUrl: '',
  isjs: true,
  variantName: '',
  variants: [
    {
      variantId: 1,
      variantName: 'variant',
      style: `#element > * {
  display: block;
  background-color: white;
  margin: auto;
}`,
      code: '<sifrr-placeholder>\n</sifrr-placeholder>',
      elState: 'return {\n\n}'
    }
  ]
};
class SifrrSingleShowcase extends SifrrDom.Element {
  static get template() {
    return template$3;
  }
  static observedAttrs() {
    return ['url'];
  }
  onConnect() {
    this.switchVariant();
    Sifrr.Dom.Event.addListener('click', '.variant', (e, el) => {
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
    let state;
    try {
      state = new Function(this.$('#elState').value).call(this.element());
    } catch (e) {    }
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
      style: this.state.style,
      code: this.state.code,
      elState: this.state.elState
    }));
    this.switchVariant(id);
  }
  deleteVariant(id) {
    this.state.variants.forEach((s, i) => {
      if (s.variantId == id) {
        this.state.variants.splice(i, 1);
        if (this.state.variantId == id) this.switchVariant((this.state.variants[i] || {}).variantId);
        else this.update();
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
    Object.assign(this.state, this.variant(id));
    this.update();
  }
  updateHtml(e, el) {
    const html = `<${el.value}></${el.value}>`;
    this.state = { code: html, element: el.value };
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

const template$4 = SifrrDom.template`<style media="screen">
  ${css$2}
</style>
<div class="container">
  <div class="flex-column" id="sidemenu">
    <div class="box">
      <h1 class="font head">Sifrr Showcase</h1>
      <p class="font" id="loader"></p>
      <input id="url" type="text" placeholder="Enter url here..." name="url" />
      <button type="button" name="loadUrl" _click=\${this.loadUrl}>Load from url</button>
      <p class="font" id="status"></p>
      <span class="button font">
        Upload File
        <input type="file" name="file" accept="application/json" _input="\${this.loadFile}" />
      </span>
      <button class="font" type="button" name="saveFile" _click="\${this.saveFile}">Save to File</button>
      <h3 class="font head">Showcases</h3>
      <input id="showcaseName" type="text" name="showcase" _input=\${this.changeName} value=\${this.state.showcases[this.state.current].name}>
      <button class="font" type="button" name="createVariant" _click="\${this.createShowcase}">Create new showcase</button>
      <div id="showcases" data-sifrr-repeat="\${this.state.showcases}">
        <li class="font showcase small" data-showcase-id="\${this.state.key}" draggable="true">\${this.state.name}<span>X</span></li>
      </div>
    </div>
  </div>
  <sifrr-single-showcase _update=\${this.saveShowcase}></sifrr-single-showcase>
</div>`;
const storage = new SifrrStorage({ name: 'showcases', version: '1.0' });
class SifrrShowcase extends SifrrDom.Element {
  static get template() {
    return template$4;
  }
  static observedAttrs() {
    return ['url'];
  }
  onAttributeChange(n, _, value) {
    if (n === 'url') this.url = value;
  }
  onConnect() {
    Sifrr.Dom.Event.addListener('click', '.showcase', (e, el) => {
      if (el.matches('.showcase')) this.switchShowcase(this.getChildIndex(el));
      if (el.matches('.showcase span')) this.deleteShowcase(this.getChildIndex(el.parentNode));
    });
    this.loadUrl();
    this.switchShowcase(0);
    if (window.Sortable) {
      const me = this;
      new window.Sortable(this.$('#showcases'), {
        draggable: 'li',
        onEnd: (e) => {
          const o = e.oldIndex, n = e.newIndex;
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
    while((el = el.previousElementSibling) != null) i++;
    return i;
  }
  deleteShowcase(i) {
    this.state.showcases.splice(i, 1);
    if (i == this.state.current) this.switchShowcase(this.state.current);
    else this.switchShowcase(this.state.current - 1);
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
    this.state = { current: i };
    this.el._state = this.state.showcases[i];
    this.el.update();
    this.$('#showcases').children[i].id = 'showcase' + i;
    this.$('#showcases').children[i].classList.add('current');
  }
  onStateChange() {
    if (this.state.current !== this.current) this.switchShowcase(this.state.current);
  }
  saveShowcase() {
    this.state.showcases[this.state.current] = Object.assign(this.state.showcases[this.state.current] || {}, JSON.parse(JSON.stringify(this.el.state)));
    if (this._loaded) {
      this.$('#status').textContent = 'saving locally!';
      if (this._timeout) clearTimeout(this._timeout);
      this._timeout = setTimeout(() => {
        this._timeout = null;
        storage.set({ showcases: this.state.showcases, current: this.state.current }).then(() => {
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
    window.fetch(this._url).then((resp) => resp.json()).then(v => {
      this.state.showcases = v.showcases;
      this.switchShowcase(v.current);
      this.$('#status').textContent = 'loaded from url!';
    }).catch((e) => {
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

const template$5 = "<style media=\"screen\">\n  * {\n    box-sizing: border-box;\n  }\n\n  .circle {\n    position: relative;\n    border: 2px solid #666;\n    padding: 0;\n    margin: 0;\n    width: 100%;\n    height: 100%;\n    border-radius: 50%;\n  }\n\n  .left-half, .bar, .f50-bar {\n    position: absolute;\n    margin: 0;\n    padding: 0;\n    width: 100%;\n    height: 100%;\n    border-radius: 50%;\n    top: 0;\n    left: 0;\n  }\n\n  .left-half {\n    width: calc(100% + 4px);\n    height: calc(100% + 4px);\n    margin: -2px;\n    clip-path: polygon(50% 0, 100% 0%, 100% 100%, 50% 100%);\n  }\n\n  .circle.over50 .left-half {\n    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);\n  }\n\n  .bar {\n    clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);\n    border: 2px solid #ffffff;\n  }\n\n  .circle.over50 .f50-bar {\n    clip-path: polygon(50% 0, 100% 0%, 100% 100%, 50% 100%);\n    border: 2px solid #ffffff;\n    box-sizing: border-box;\n  }\n\n  .circle:not(.over50) .f50-bar {\n    display: none\n  }\n\n  .circle .bar {\n    transform: rotate(${this.state.progress * 360 / 100}deg)\n  }\n</style>\n<div class=\"circle ${this.state.progress > 50 ? 'over50' : ''}\">\n  <div class=\"left-half\">\n    <div class=\"f50-bar\"></div>\n    <div class=\"bar\"></div>\n  </div>\n</div>\n";

class SifrrProgressRound extends Sifrr.Dom.Element {
  static get template() {
    return SifrrDom.template(template$5);
  }
  static observedAttrs() {
    return ['progress'];
  }
  get progress() {
    return this._state.progress;
  }
  set progress(v) {
    return this.state = { progress: v };
  }
  onAttributeChange(n, _, v) {
    if (n === 'progress') this.state = { [n]: v };
  }
}
SifrrProgressRound.defaultState = { progress: 0 };
SifrrDom.register(SifrrProgressRound);

export { SifrrCodeEditor, SifrrLazyPicture, SifrrLazyImg as SifrrLazzyImg, SifrrProgressRound, SifrrShowcase, SifrrStater, SifrrTabs, animate_1 as animate };
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrelements.module.js.map
