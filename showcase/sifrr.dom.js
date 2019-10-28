/*! Sifrr.Dom v0.0.6 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr */
this.Sifrr = this.Sifrr || {};
this.Sifrr.Dom = (function (exports) {
  'use strict';

  var temp = window.document.createElement('template');
  var script = window.document.createElement('script');
  var reg = '(\\${(?:(?:[^{}$]|{(?:[^{}$])*})*)})';
  var TEMPLATE = () => temp.cloneNode(false);
  var TREE_WALKER = () => window.document.createTreeWalker(window.document, window.NodeFilter.SHOW_ALL, null, false);
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  var ELEMENT_NODE = 1;
  var OUTER_REGEX = new RegExp(reg, 'g');
  var STATE_REGEX = /^\$\{this\.state\.([a-zA-Z0-9_$]+)\}$/;
  var HTML_ATTR = ':sifrr-html';
  var BIND_SELECTOR = '[\\3A sifrr-bind]';
  var BIND_PROP = 'sifrrBind';
  var REPEAT_ATTR = ':sifrr-repeat';
  var RENDER_IF_PROP = 'renderIf';

  var TW_SHARED = TREE_WALKER();
  function collect(element, stateMap) {
    var l = stateMap.length,
        refs = new Array(l);
    TW_SHARED.currentNode = element;
    for (var i = 0, n; i < l; i++) {
      n = stateMap[i].idx;
      while (--n) {
        element = TW_SHARED.nextNode();
      }
      refs[i] = element;
    }
    return refs;
  }
  function create(node, fxn, passedArg) {
    var TW = TREE_WALKER();
    var indices = [],
        ref,
        idx = 0,
        ntr;
    TW.currentNode = node;
    while (node) {
      if (node.nodeType === TEXT_NODE && node.data.trim() === '') {
        ntr = node;
        node = TW.nextNode();
        ntr.remove();
      } else {
        if (ref = fxn(node, passedArg)) {
          indices.push({
            idx: idx + 1,
            ref
          });
          idx = 1;
        } else {
          idx++;
        }
        node = TW.nextNode();
      }
    }
    return indices;
  }

  const template = ((str, ...extra) => {
    if (str.tagName && str.tagName === 'TEMPLATE') return str;
    var isString = false;
    var tmp = TEMPLATE();
    if (typeof str === 'string') {
      isString = true;
      if (typeof extra[0] === 'string') str = "<style>".concat(extra.join(''), "</style>").concat(str);
    } else if (Array.isArray(str) && typeof str[0] === 'string') {
      isString = true;
      str = String.raw(str, ...extra);
    } else if (str instanceof NodeList || Array.isArray(str) && str[0].nodeType) {
      Array.from(str).forEach(s => {
        tmp.content.appendChild(s);
      });
    } else if (str.nodeType) {
      tmp.content.appendChild(str);
    } else {
      throw Error('Argument must be of type string | template literal | Node | [Node] | NodeList');
    }
    if (isString) tmp.innerHTML = str.replace(/(\\)?\$(\\)?\{/g, '${');
    return tmp;
  });

  const updateAttribute = ((element, name, newValue) => {
    if (newValue === false || newValue === null || newValue === undefined) element.hasAttribute(name) && element.removeAttribute(name);else if (name === 'class') element.className = newValue;else if ((name === 'id' || name === 'value') && element[name] !== newValue) element[name] = newValue;else if (element.getAttribute(name) !== newValue) element.setAttribute(name, newValue);
  });

  const shouldMerge = ((a, b) => {
    if (typeof a !== 'object') return a !== b;
    if (a === null || b === null) return a === b;
    for (var key in b) {
      if (!(key in a) || a[key] !== b[key]) return true;
    }
    return false;
  });

  function makeChildrenEqual(parent, newChildren, createFn, isNode = false) {
    var newL = newChildren.length,
        oldL = parent.childNodes.length;
    if (oldL > newL) {
      var i = oldL;
      while (i > newL) {
        parent.removeChild(parent.lastChild);
        i--;
      }
    }
    var item,
        head = parent.firstChild,
        curNewChild = newChildren[0];
    if (isNode) {
      while (head) {
        item = curNewChild.nextSibling;
        head = makeEqual(head, curNewChild).nextSibling;
        curNewChild = item;
      }
      while (curNewChild) {
        item = curNewChild.nextSibling;
        parent.appendChild(curNewChild);
        curNewChild = item;
      }
    } else {
      var _i = 0;
      while (head) {
        head = makeEqual(head, newChildren[_i]).nextSibling;
        _i++;
      }
      while (_i < newL) {
        item = newChildren[_i];
        parent.appendChild(item.nodeType ? item : createFn(item));
        _i++;
      }
    }
  }
  function makeEqual(oldNode, newNode) {
    if (!newNode.nodeType) {
      if (shouldMerge(oldNode.state, newNode)) oldNode.setState(newNode);
      return oldNode;
    }
    if (oldNode.nodeName !== newNode.nodeName) {
      oldNode.replaceWith(newNode);
      return newNode;
    }
    if (oldNode.nodeType === TEXT_NODE || oldNode.nodeType === COMMENT_NODE) {
      if (oldNode.data !== newNode.data) oldNode.data = newNode.data;
      return oldNode;
    }
    if (newNode.state) oldNode.setState && oldNode.setState(newNode.state);
    var oldAttrs = oldNode.attributes,
        newAttrs = newNode.attributes;
    for (var i = newAttrs.length - 1; i > -1; --i) {
      updateAttribute(oldNode, newAttrs[i].name, newAttrs[i].value);
    }
    for (var j = oldAttrs.length - 1; j > -1; --j) {
      if (!newNode.hasAttribute(oldAttrs[j].name)) oldNode.removeAttribute(oldAttrs[j].name);
    }
    makeChildrenEqual(oldNode, newNode.childNodes, undefined, true);
    return oldNode;
  }

  function makeChildrenEqualKeyed(parent, newData, createFn, key) {
    var newL = newData.length,
        oldL = parent.childNodes.length;
    if (oldL === 0) {
      for (var i = 0; i < newL; i++) {
        parent.appendChild(createFn(newData[i]));
      }
      return;
    }
    var prevStart = 0,
        newStart = 0,
        loop = true,
        prevEnd = oldL - 1,
        newEnd = newL - 1,
        prevStartNode = parent.firstChild,
        prevEndNode = parent.lastChild,
        finalNode,
        a,
        b,
        _node;
    fixes: while (loop) {
      loop = false;
      a = prevStartNode.state, b = newData[newStart];
      while (a[key] === b[key]) {
        makeEqual(prevStartNode, b);
        prevStart++;
        prevStartNode = prevStartNode.nextSibling;
        newStart++;
        if (prevEnd < prevStart || newEnd < newStart) break fixes;
        a = prevStartNode.state, b = newData[newStart];
      }
      a = prevEndNode.state, b = newData[newEnd];
      while (a[key] === b[key]) {
        makeEqual(prevEndNode, b);
        prevEnd--;
        finalNode = prevEndNode;
        prevEndNode = prevEndNode.previousSibling;
        newEnd--;
        if (prevEnd < prevStart || newEnd < newStart) break fixes;
        a = prevEndNode.state, b = newData[newEnd];
      }
      a = prevEndNode.state, b = newData[newStart];
      while (a[key] === b[key]) {
        loop = true;
        makeEqual(prevEndNode, b);
        _node = prevEndNode.previousSibling;
        parent.insertBefore(prevEndNode, prevStartNode);
        prevEndNode = _node;
        prevEnd--;
        newStart++;
        if (prevEnd < prevStart || newEnd < newStart) break fixes;
        a = prevEndNode.state, b = newData[newStart];
      }
      a = prevStartNode.state, b = newData[newEnd];
      while (a[key] === b[key]) {
        loop = true;
        makeEqual(prevStartNode, b);
        _node = prevStartNode.nextSibling;
        parent.insertBefore(prevStartNode, prevEndNode.nextSibling);
        finalNode = prevStartNode;
        prevEndNode = prevStartNode.previousSibling;
        prevStartNode = _node;
        prevStart++;
        newEnd--;
        if (prevEnd < prevStart || newEnd < newStart) break fixes;
        a = prevStartNode.state, b = newData[newEnd];
      }
    }
    if (newEnd < newStart) {
      if (prevStart <= prevEnd) {
        var next;
        while (prevStart <= prevEnd) {
          if (prevEnd === 0) {
            parent.removeChild(prevEndNode);
          } else {
            next = prevEndNode.previousSibling;
            parent.removeChild(prevEndNode);
            prevEndNode = next;
          }
          prevEnd--;
        }
      }
      return;
    }
    if (prevEnd < prevStart) {
      if (newStart <= newEnd) {
        while (newStart <= newEnd) {
          _node = createFn(newData[newStart]);
          parent.insertBefore(_node, finalNode);
          newStart++;
        }
      }
      return;
    }
    var oldKeys = new Array(newEnd + 1 - newStart),
        newKeys = new Map(),
        nodes = new Array(prevEnd - prevStart + 1),
        toDelete = [];
    for (var _i = newStart; _i <= newEnd; _i++) {
      oldKeys[_i] = -1;
      newKeys.set(newData[_i][key], _i);
    }
    var reusingNodes = 0;
    while (prevStart <= prevEnd) {
      if (newKeys.has(prevStartNode.state[key])) {
        oldKeys[newKeys.get(prevStartNode.state[key])] = prevStart;
        reusingNodes++;
      } else {
        toDelete.push(prevStartNode);
      }
      nodes[prevStart] = prevStartNode;
      prevStartNode = prevStartNode.nextSibling;
      prevStart++;
    }
    for (var _i2 = 0; _i2 < toDelete.length; _i2++) {
      parent.removeChild(toDelete[_i2]);
    }
    if (reusingNodes === 0) {
      for (var _i3 = newStart; _i3 <= newEnd; _i3++) {
        parent.insertBefore(createFn(newData[_i3]), prevStartNode);
      }
      return;
    }
    var longestSeq = longestPositiveIncreasingSubsequence(oldKeys, newStart);
    var lisIdx = longestSeq.length - 1,
        tmpD;
    for (var _i4 = newEnd; _i4 >= newStart; _i4--) {
      if (longestSeq[lisIdx] === _i4) {
        finalNode = nodes[oldKeys[_i4]];
        makeEqual(finalNode, newData[_i4]);
        lisIdx--;
      } else {
        if (oldKeys[_i4] === -1) {
          tmpD = createFn(newData[_i4]);
        } else {
          tmpD = nodes[oldKeys[_i4]];
          makeEqual(tmpD, newData[_i4]);
        }
        parent.insertBefore(tmpD, finalNode);
        finalNode = tmpD;
      }
    }
  }
  function longestPositiveIncreasingSubsequence(ns, newStart) {
    var seq = [],
        is = [],
        l = -1,
        pre = new Array(ns.length);
    for (var i = newStart, len = ns.length; i < len; i++) {
      var n = ns[i];
      if (n < 0) continue;
      var j = findGreatestIndexLEQ(seq, n);
      if (j !== -1) pre[i] = is[j];
      if (j === l) {
        l++;
        seq[l] = n;
        is[l] = i;
      } else if (n < seq[j + 1]) {
        seq[j + 1] = n;
        is[j + 1] = i;
      }
    }
    for (var _i5 = is[l]; l > -1; _i5 = pre[_i5], l--) {
      seq[l] = _i5;
    }
    return seq;
  }
  function findGreatestIndexLEQ(seq, n) {
    var lo = -1,
        hi = seq.length;
    if (hi > 0 && seq[hi - 1] <= n) return hi - 1;
    while (hi - lo > 1) {
      var mid = Math.floor((lo + hi) / 2);
      if (seq[mid] > n) {
        hi = mid;
      } else {
        lo = mid;
      }
    }
    return lo;
  }

  function replacer(match) {
    var f;
    if (match.indexOf('return ') > -1) {
      f = match;
    } else {
      f = 'return ' + match;
    }
    try {
      return new Function(f);
    } catch (e) {
      window.console.log("Error processing binding: `".concat(f, "`"));
      window.console.error(e);
      return '';
    }
  }
  function evaluate(el, fxn) {
    try {
      if (typeof fxn !== 'function') return fxn;else return fxn.call(el);
    } catch (e) {
      var str = fxn.toString();
      window.console.log("Error evaluating: `".concat(str.slice(str.indexOf('{') + 1, str.lastIndexOf('}')), "` for element"), el);
      window.console.error(e);
      return '';
    }
  }
  var getBindingFxns = string => {
    var splitted = string.split(OUTER_REGEX),
        l = splitted.length,
        ret = [];
    for (var i = 0; i < l; i++) {
      if (splitted[i][0] === '$' && splitted[i][1] === '{') {
        ret.push(replacer(splitted[i].slice(2, -1)));
      } else if (splitted[i]) ret.push(splitted[i]);
    }
    if (ret.length === 1) return ret[0];
    return ret;
  };
  var getStringBindingFxn = string => {
    var match = string.match(STATE_REGEX);
    if (match) return match[1];
    return getBindingFxns(string);
  };
  var evaluateBindings = (fxns, element) => {
    if (typeof fxns === 'function') return evaluate(element, fxns);
    var binded = evaluate.bind(null, element);
    return fxns.map(binded).join('');
  };

  var displayNone = 'none';
  var renderIf = (dom, shouldRender = dom[RENDER_IF_PROP] != false) => {
    if (dom.___oldRenderIf === shouldRender) return shouldRender;
    dom.___oldRenderIf = shouldRender;
    if (shouldRender) {
      dom.style.display = dom.__sifrrOldDisplay;
      return true;
    } else {
      dom.__sifrrOldDisplay = dom.style.display;
      dom.style.display = displayNone;
      return false;
    }
  };
  function update(element, stateMap) {
    if (element.nodeType === ELEMENT_NODE && !renderIf(element)) return;
    stateMap = stateMap || element.constructor.stateMap;
    for (var i = element._refs ? element._refs.length - 1 : -1; i > -1; --i) {
      var data = stateMap[i].ref,
          dom = element._refs[i];
      if (data.type === 0) {
        if (dom.__data != element.state[data.text]) dom.data = dom.__data = element.state[data.text];
        continue;
      } else if (data.type === 1) {
        var _newValue = evaluateBindings(data.text, element);
        if (dom.data != _newValue) dom.data = _newValue;
        continue;
      }
      if (!dom._sifrrEventSet) {
        if (data.events) {
          for (var _i = data.events.length - 1; _i > -1; --_i) {
            var ev = data.events[_i];
            dom[ev[0]] = evaluateBindings(ev[1], element);
          }
          dom._root = element;
        }
        dom._sifrrEventSet = true;
      }
      if (data.state) {
        var newState = evaluateBindings(data.state, element);
        if (dom.setState && shouldMerge(dom.state, newState)) dom.setState(newState);else dom['state'] = newState;
      }
      if (data.props) {
        var dirty = dom.onPropsChange ? [] : false;
        for (var _i2 = data.props.length - 1; _i2 > -1; --_i2) {
          var _newValue2 = evaluateBindings(data.props[_i2][1], element);
          if (data.props[_i2][0] === 'style') {
            var keys = Object.keys(_newValue2),
                l = keys.length;
            for (var _i3 = 0; _i3 < l; _i3++) {
              if (dom.style[keys[_i3]] !== _newValue2[keys[_i3]]) dom.style[keys[_i3]] = _newValue2[keys[_i3]];
            }
          } else if (_newValue2 !== dom[data.props[_i2][0]]) {
            dom[data.props[_i2][0]] = _newValue2;
            dirty && dirty.push(data.props[_i2][0]);
            if (data.props[_i2][0] === RENDER_IF_PROP) {
              if (renderIf(dom)) typeof dom.update === 'function' && dom.update();
            }
          }
        }
        dirty && dirty.length > 0 && dom.onPropsChange(dirty);
      }
      if (data.attributes) {
        for (var _i4 = data.attributes.length - 1; _i4 > -1; --_i4) {
          var attr = data.attributes[_i4];
          var _newValue3 = void 0;
          if (attr[1] === 0) _newValue3 = element.state[attr[2]];else _newValue3 = evaluateBindings(attr[2], element);
          updateAttribute(dom, attr[0], _newValue3);
        }
      }
      if (data.type === 3) {
        if (!dom.sifrrRepeat || dom.sifrrRepeat.length === 0) dom.textContent = '';else if (dom.sifrrKey) {
          makeChildrenEqualKeyed(dom, dom.sifrrRepeat, data.se.sifrrClone.bind(data.se), dom.sifrrKey);
        } else makeChildrenEqual(dom, dom.sifrrRepeat, data.se.sifrrClone.bind(data.se));
        continue;
      }
      if (data.text === undefined) continue;
      var newValue = void 0;
      if (typeof data.text === 'string') newValue = element.state[data.text];else newValue = evaluateBindings(data.text, element);
      if (!newValue || newValue.length === 0) dom.textContent = '';else {
        var _newValue4 = evaluateBindings(data.text, element);
        var children = void 0,
            isNode = false;
        if (Array.isArray(_newValue4)) {
          children = _newValue4;
        } else if (_newValue4.content && _newValue4.content.nodeType === 11) {
          children = _newValue4.content.childNodes;
          isNode = true;
        } else if (_newValue4.nodeType) {
          children = [_newValue4];
        } else if (typeof _newValue4 === 'string') {
          var temp = TEMPLATE();
          temp.innerHTML = _newValue4.toString();
          children = temp.content.childNodes;
          isNode = true;
        } else {
          children = Array.prototype.slice.call(_newValue4);
        }
        makeChildrenEqual(dom, children, undefined, isNode);
      }
    }
  }

  function sifrrClone(newState) {
    var clone = this.cloneNode(true);
    clone.root = this._root;
    clone._refs = collect(clone, this.stateMap);
    clone.state = Object.assign({}, this.sifrrDefaultState, newState);
    clone.setState = this.stateProps.setState;
    update(clone, this.stateMap);
    return clone;
  }
  function SimpleElement(content, defaultState = null) {
    var templ = template(content);
    content = templ.content.firstElementChild || templ.content.firstChild;
    if (content.isSifrr || content.nodeName.indexOf('-') !== -1 || content.getAttribute && content.getAttribute('is') && content.getAttribute('is').indexOf('-') > 0) {
      if (!content.isSifrr) {
        window.document.body.appendChild(content);
        window.document.body.removeChild(content);
      }
      if (content.isSifrr) return content;
    }
    content.sifrrDefaultState = defaultState;
    content.stateMap = create(content, creator, defaultState);
    content.sifrrClone = sifrrClone;
    content.stateProps = {
      setState: function (v) {
        if (!this.state) return;
        if (this.state !== v) Object.assign(this.state, v);
        update(this, content.stateMap);
      }
    };
    return content;
  }

  function attrToProp(attrName) {
    return attrName.substr(1).replace(/-([a-z])/g, g => g[1].toUpperCase());
  }
  function creator(el, defaultState) {
    if (el.nodeType === TEXT_NODE || el.nodeType === COMMENT_NODE) {
      var x = el.data;
      if (x.indexOf('${') > -1) {
        var binding = getStringBindingFxn(x.trim());
        if (typeof binding !== 'string') {
          return {
            type: 1,
            text: binding
          };
        } else {
          if (defaultState) el.data = el.__data = defaultState[binding];
          return {
            type: 0,
            text: binding
          };
        }
      }
    } else if (el.nodeType === ELEMENT_NODE) {
      var sm = {};
      if (el.hasAttribute(HTML_ATTR)) {
        var innerHTML = el.innerHTML;
        if (innerHTML.indexOf('${') > -1) {
          sm.type = 2;
          sm.text = getBindingFxns(innerHTML.replace(/<!--((?:(?!-->).)+)-->/g, '$1').trim());
        }
        el.textContent = '';
      } else if (el.hasAttribute(REPEAT_ATTR)) {
        sm.type = 3;
        sm.se = SimpleElement(el.childNodes);
      }
      var attrs = Array.prototype.slice.call(el.attributes),
          l = attrs.length;
      var attrStateMap = [];
      var eventMap = [];
      var propMap = [];
      for (var i = 0; i < l; i++) {
        var attribute = attrs[i];
        if (attribute.name[0] === ':') {
          if (attribute.value.indexOf('${') < 0) {
            propMap.push([attrToProp(attribute.name), [attribute.value]]);
          } else if (attribute.name === ':state') {
            sm['state'] = getBindingFxns(attribute.value);
          } else {
            propMap.push([attrToProp(attribute.name), getBindingFxns(attribute.value)]);
          }
          el.setAttribute(attribute.name, '');
        }
        if (attribute.value.indexOf('${') < 0) continue;
        if (attribute.name[0] === '_') {
          eventMap.push([attribute.name, getBindingFxns(attribute.value)]);
        } else if (attribute.name[0] !== ':') {
          var _binding = getStringBindingFxn(attribute.value);
          if (typeof _binding !== 'string') {
            attrStateMap.push([attribute.name, 1, _binding]);
          } else {
            attrStateMap.push([attribute.name, 0, _binding]);
            if (defaultState) updateAttribute(el, attribute.name, defaultState[_binding]);
          }
        }
      }
      if (eventMap.length > 0) sm.events = eventMap;
      if (propMap.length > 0) sm.props = propMap;
      if (attrStateMap.length > 0) sm.attributes = attrStateMap;
      if (Object.keys(sm).length > 0) return sm;
    }
    return 0;
  }

  const config = {
    baseUrl: '',
    useShadowRoot: true,
    events: []
  };

  class Loader {
    constructor(elemName, url) {
      if (!fetch) throw Error('Sifrr.Dom.load requires window.fetch API to work.');
      if (this.constructor.all[elemName]) return this.constructor.all[elemName];
      this.elementName = elemName;
      this.constructor.all[this.elementName] = this;
      this.url = url;
    }
    executeScripts(js = true) {
      if (this._exec) return this._exec;
      if (!js) {
        return this._exec = this.constructor.executeHTML(this.getUrl('html'), this), this._exec;
      } else {
        return this._exec = this.constructor.executeJS(this.getUrl('js')).catch(e => {
          console.error(e);
          console.log("JS file for '".concat(this.elementName, "' gave error. Trying to get html file."));
          return this.constructor.executeHTML(this.getUrl('html'), this);
        }), this._exec;
      }
    }
    getUrl(type = 'js') {
      if (this.url) return this.url;
      if (typeof config.url === 'function') return this.url(this.elementName);
      return "".concat(config.baseUrl + '/', "elements/").concat(this.elementName.split('-').join('/'), ".").concat(type);
    }
    static getFile(url) {
      return window.fetch(url).then(resp => {
        if (resp.ok) return resp.text();else throw Error("".concat(url, " - ").concat(resp.status, " ").concat(resp.statusText));
      });
    }
    static executeHTML(url, me) {
      return this.getFile(url).then(file => template(file).content).then(content => {
        var promise = Promise.resolve(true);
        me.template = content.querySelector('template');
        content.querySelectorAll('script').forEach(script => {
          if (script.src) {
            window.fetch(script.src);
            promise = promise.then(() => window.fetch(script.src).then(resp => resp.text())).then(text => new Function(text + "\n//# sourceURL=".concat(script.src)).call(window));
          } else {
            promise = promise.then(() => new Function(script.text + "\n//# sourceURL=".concat(url)).call(window));
          }
        });
        return promise;
      });
    }
    static executeJS(url) {
      return this.getFile(url).then(script => {
        return new Function(script + "\n //# sourceURL=".concat(url)).call();
      });
    }
  }
  Loader.all = {};

  var SYNTHETIC_EVENTS = {};
  var listenOpts = {
    capture: true,
    passive: true
  };
  var customOpts = {
    composed: true,
    bubbles: true
  };
  var cssMatchEvent = (e, name, dom, target) => {
    function callEach(fxns, isElement) {
      fxns.forEach(fxn => {
        if (!isElement || fxn.__dom === dom) fxn(e, target, dom);
      });
    }
    for (var css in SYNTHETIC_EVENTS[name]) {
      if (typeof dom.matches === 'function' && dom.matches(css) || dom.nodeType === 9 && css === 'document' || css === 'element') callEach(SYNTHETIC_EVENTS[name][css], css === 'element');
    }
  };
  var getEventListener = name => {
    return e => {
      var target = e.composedPath ? e.composedPath()[0] : e.target;
      var dom = target;
      while (dom) {
        var eventHandler = dom["_".concat(name)] || (dom.hasAttribute ? dom.getAttribute("_".concat(name)) : null);
        if (typeof eventHandler === 'function') {
          eventHandler.call(dom._root || window, e, target);
        } else if (typeof eventHandler === 'string') {
          new Function('event', 'target', eventHandler).call(dom._root || window, event, target);
        }
        cssMatchEvent(e, name, dom, target);
        dom = dom.parentNode || dom.host;
      }
    };
  };
  var add = name => {
    if (SYNTHETIC_EVENTS[name]) return false;
    var namedEL = getEventListener(name);
    document.addEventListener(name, namedEL, listenOpts);
    SYNTHETIC_EVENTS[name] = {};
    return true;
  };
  var addListener = (name, css, fxn) => {
    if (!SYNTHETIC_EVENTS[name]) throw Error("You need to call Sifrr.Dom.Event.add('".concat(name, "') before using listeners."));
    if (typeof css !== 'string') {
      fxn.__dom = css;
      css = 'element';
    }
    SYNTHETIC_EVENTS[name][css] = SYNTHETIC_EVENTS[name][css] || new Set();
    SYNTHETIC_EVENTS[name][css].add(fxn);
    return true;
  };
  var removeListener = (name, css, fxn) => {
    if (SYNTHETIC_EVENTS[name][css]) SYNTHETIC_EVENTS[name][css].delete(fxn);
    return true;
  };
  var trigger = (el, name, options) => {
    if (typeof el === 'string') el = document.$(el);
    el.dispatchEvent(new CustomEvent(name, Object.assign(customOpts, options)));
  };

  const Event = /*#__PURE__*/Object.freeze({
    all: SYNTHETIC_EVENTS,
    getEventListener: getEventListener,
    add: add,
    addListener: addListener,
    removeListener: removeListener,
    trigger: trigger
  });

  function elementClassFactory(baseClass) {
    return class extends baseClass {
      static extends(htmlElementClass) {
        return elementClassFactory(htmlElementClass);
      }
      static get observedAttributes() {
        return this.observedAttrs();
      }
      static observedAttrs() {
        return [];
      }
      static get template() {
        return (Loader.all[this.elementName] || {
          template: false
        }).template;
      }
      static get ctemp() {
        if (this._ctemp) return this._ctemp;
        if (this.template) {
          this._ctemp = template(this.template);
          if (this.useShadowRoot && window.ShadyCSS && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.prepareTemplate(this._ctemp, this.elementName);
          }
          this.stateMap = create(this._ctemp.content, creator, this.defaultState);
        }
        return this._ctemp || false;
      }
      static get elementName() {
        return this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      }
      static get useShadowRoot() {
        return this.useSR;
      }
      constructor() {
        super();
        if (this.constructor.ctemp) {
          this.state = Object.assign({}, this.constructor.defaultState, this.state);
          var content = this.constructor.ctemp.content.cloneNode(true);
          this._refs = collect(content, this.constructor.stateMap);
          if (this.constructor.useShadowRoot) {
            this.attachShadow({
              mode: 'open'
            });
            this.shadowRoot.appendChild(content);
          } else {
            this.__content = content;
          }
        }
      }
      connectedCallback() {
        this.connected = true;
        this._root = undefined;
        if (this.__content) {
          if (this.childNodes.length !== 0) this.textContent = '';
          this.appendChild(this.__content);
          delete this.__content;
        }
        this.update();
        this.onConnect();
      }
      onConnect() {}
      disconnectedCallback() {
        this.connected = false;
        this.onDisconnect();
      }
      onDisconnect() {}
      attributeChangedCallback(attrName, oldVal, newVal) {
        this.onAttributeChange(attrName, oldVal, newVal);
      }
      onAttributeChange() {}
      setState(v) {
        if (!this.state) return;
        if (this.state !== v) Object.assign(this.state, v);
        this.update();
        this.onStateChange();
      }
      onStateChange() {}
      setProp(name, value) {
        this[name] = value;
        this.onPropsChange && this.onPropsChange([name]);
      }
      update() {
        this.beforeUpdate();
        update(this);
        if (this._update || this.triggerUpdate || this[BIND_PROP]) {
          trigger(this, 'update', {
            detail: {
              state: this.state
            }
          });
        }
        this.onUpdate();
      }
      beforeUpdate() {}
      onUpdate() {}
      isSifrr(name = null) {
        if (name) return name === this.constructor.elementName;else return true;
      }
      sifrrClone(state) {
        var clone = this.cloneNode(false);
        clone.state = state;
        return clone;
      }
      clearState() {
        this.state = {};
        this.update();
      }
      $(args, sr = true) {
        if (this.shadowRoot && sr) return this.shadowRoot.querySelector(args);else return this.querySelector(args);
      }
      $$(args, sr = true) {
        if (this.shadowRoot && sr) return this.shadowRoot.querySelectorAll(args);else return this.querySelectorAll(args);
      }
      get root() {
        if (!this._root) {
          var root = this.parentNode;
          while (root && !root.isSifrr) {
            root = root.parentNode || root.host;
          }
          if (root && root.isSifrr) this._root = root;
        }
        return this._root;
      }
    };
  }
  const Element = elementClassFactory(window.HTMLElement);

  const twoWayBind = (e => {
    var target = e.composedPath ? e.composedPath()[0] : e.target;
    if (!target[BIND_PROP]) return;
    if (e.type === 'update' && !target._sifrrEventSet) return;
    var value = target.value || target.state || target.textContent;
    if (target.firstChild) target.firstChild.__data = value;
    var root = target._root || target.root || target.parentNode;
    while (root && !root.isSifrr) {
      root = root.parentNode || root.host;
    }
    if (root) {
      target._root = root;
      var prop = target[BIND_PROP];
      if (typeof prop === 'function') {
        prop.call(root, value);
        root.update && root.update();
      } else if (e.type === 'update') root.setState && root.setState({
        [prop]: Object.assign({}, value)
      });else root.setState && root.setState({
        [prop]: value
      });
    } else target._root = null;
  });

  var objCon = {}.constructor;
  class Store {
    constructor(initial) {
      this.value = initial;
      this.listeners = [];
      this.addListener = this.listeners.push.bind(this.listeners);
    }
    set(newValue) {
      if (shouldMerge(this.value, newValue)) {
        if (this.value.constructor === objCon) Object.assign(this.value, newValue);else this.value = newValue;
      }
      this.listeners.forEach(l => l());
    }
  }
  function bindStoresToElement(element, stores = []) {
    var update = element.update.bind(element);
    if (Array.isArray(stores)) stores.forEach(s => s.addListener(update));else stores.addListener(update);
  }

  var elements = {};
  var loadingElements = {};
  var registering = {};
  var register = (Element, options = {}) => {
    Element.useSR = config.useShadowRoot;
    var name = options.name || Element.elementName;
    if (!name) {
      return Promise.reject(Error('Error creating Custom Element: No name given.', Element));
    } else if (window.customElements.get(name)) {
      console.warn("Error creating Element: ".concat(name, " - Custom Element with this name is already defined."));
      return Promise.resolve(false);
    } else if (name.indexOf('-') < 1) {
      return Promise.reject(Error("Error creating Element: ".concat(name, " - Custom Element name must have one dash '-'")));
    } else {
      var before;
      if (Array.isArray(options.dependsOn)) {
        before = Promise.all(options.dependsOn.map(en => load(en)));
      } else if (typeof options.dependsOn === 'string') {
        before = load(options.dependsOn);
      } else before = Promise.resolve(true);
      delete options.dependsOn;
      var registeringPromise = before.then(() => window.customElements.define(name, Element, options));
      registering[name] = registering;
      return registeringPromise.then(() => {
        elements[name] = Element;
        delete registering[name];
      }).catch(error => {
        throw Error("Error creating Custom Element: ".concat(name, " - ").concat(error.message));
      });
    }
  };
  var setup = function (newConfig) {
    HTMLElement.prototype.$ = HTMLElement.prototype.querySelector;
    HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;
    document.$ = document.querySelector;
    document.$$ = document.querySelectorAll;
    Object.assign(config, newConfig);
    if (typeof config.baseUrl !== 'string' && typeof config.url !== 'function') throw Error('baseUrl should be a string, or url should be function');
    config.events.push('input', 'change', 'update');
    config.events.forEach(e => add(e));
    addListener('input', BIND_SELECTOR, twoWayBind);
    addListener('change', BIND_SELECTOR, twoWayBind);
    addListener('update', BIND_SELECTOR, twoWayBind);
  };
  var load = function (elemName, {
    url,
    js = true
  } = {}) {
    if (window.customElements.get(elemName)) {
      return Promise.resolve(window.console.warn("Error loading Element: ".concat(elemName, " - Custom Element with this name is already defined.")));
    }
    loadingElements[elemName] = window.customElements.whenDefined(elemName);
    var loader = new Loader(elemName, url);
    return loader.executeScripts(js).then(() => registering[elemName]).then(() => {
      if (!window.customElements.get(elemName)) {
        window.console.warn("Executing '".concat(elemName, "' file didn't register the element."));
      }
      delete registering[elemName];
      delete loadingElements[elemName];
    }).catch(e => {
      delete registering[elemName];
      delete loadingElements[elemName];
      throw e;
    });
  };
  var loading = () => {
    var promises = [];
    for (var el in loadingElements) {
      promises.push(loadingElements[el]);
    }
    return Promise.all(promises);
  };
  const sifrr_dom = {
    Element,
    twoWayBind,
    Loader,
    SimpleElement,
    Event,
    makeChildrenEqual,
    makeChildrenEqualKeyed,
    makeEqual,
    Store,
    template,
    register,
    setup,
    load,
    loading,
    config,
    elements,
    bindStoresToElement
  };

  exports.Element = Element;
  exports.Event = Event;
  exports.Loader = Loader;
  exports.SimpleElement = SimpleElement;
  exports.Store = Store;
  exports.bindStoresToElement = bindStoresToElement;
  exports.config = config;
  exports.default = sifrr_dom;
  exports.elements = elements;
  exports.load = load;
  exports.loading = loading;
  exports.makeChildrenEqual = makeChildrenEqual;
  exports.makeChildrenEqualKeyed = makeChildrenEqualKeyed;
  exports.makeEqual = makeEqual;
  exports.register = register;
  exports.setup = setup;
  exports.template = template;
  exports.twoWayBind = twoWayBind;

  if (exports.default) exports = exports.default;

  return exports;

}({}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrr.dom.js.map
