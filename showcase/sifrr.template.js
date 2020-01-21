/*! Sifrr.Template v0.0.6 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr */
this.Sifrr = this.Sifrr || {};
this.Sifrr.Template = (function (exports) {
  'use strict';

  // basic unique string creator
  // inspired from https://github.com/sindresorhus/crypto-random-string/blob/master/index.js, but for browser
  var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'.split('');
  var count = characters.length;

  var createUniqueString = length => {
    var string = '';
    var stringLength = 0;

    while (stringLength < length) {
      var randomCharPosition = Math.ceil(crypto.getRandomValues(new Uint8Array(1))[0] / 255 * (count - 1));
      string += characters[randomCharPosition];
      stringLength++;
    }

    return string;
  };

  var temp = document.createElement('template');
  var comment = document.createComment('Sifrr Reference Comment. Do not delete.'); // binding string

  var BIND_REF_LENGTH = 8;
  var PREFIX = 'STB_';
  var REF_REG = /\{{STB_(.{8})}}/;
  var REF_REG_GLOBAL = /\{{STB_(.{8})}}/g;
  var REF_REG_EXACT = /^{{STB_(.{8})}}$/;
  var REF_LENGTH = 4
  /* for {{}} */
  + PREFIX.length + BIND_REF_LENGTH; // dom elements

  var TEMPLATE = () => temp.cloneNode(false);
  var TREE_WALKER = root => document.createTreeWalker(root, NodeFilter.SHOW_ALL, null, false);
  var REFERENCE_COMMENT = () => comment.cloneNode(true);
  var SIFRR_FRAGMENT = () => document.createElement('sifrr-fragment'); // node types

  var TEXT_NODE = Node.TEXT_NODE;
  var COMMENT_NODE = Node.COMMENT_NODE;
  var ELEMENT_NODE = Node.ELEMENT_NODE;

  var createTemplateFromString = str => {
    var template = TEMPLATE();
    template.innerHTML = str;
    return template;
  };
  function functionMapCreator(str, substitutions) {
    var raw = str.raw;
    var functionMap = new Map();
    var mergedString = raw.map((chunk, i) => {
      var subs = substitutions[i - 1];

      if (subs === undefined) {
        return chunk;
      }

      if (typeof subs === 'function' || typeof subs === 'object' || typeof subs === 'symbol') {
        var randomString = createUniqueString(BIND_REF_LENGTH);
        functionMap.set(randomString, subs);
        return "{{".concat(PREFIX + randomString, "}}") + chunk;
      }

      return substitutions[i - 1] + chunk;
    }).join('');
    return {
      mergedString,
      functionMap
    };
  }
  function isSifrrNode(node) {
    return !!node.__tempNum;
  }
  function isSameSifrrNode(nodes, tempNums) {
    var ln = nodes.length,
        tl = tempNums.length;
    if (ln !== tl) return false;

    for (var i = 0; i < ln; i++) {
      if (nodes[i].__tempNum !== tempNums[i]) return false;
    }

    return true;
  }
  function recurseArray(values, singleValFxn, createFn) {
    if (!Array.isArray(values)) {
      if (createFn) {
        var createdV = createFn(values);

        if (Array.isArray(createdV)) {
          if (createdV.length === 1) return singleValFxn(createdV[0]);
          return recurseArray(createdV, singleValFxn);
        } else {
          return singleValFxn(createdV);
        }
      } else {
        return singleValFxn(values);
      }
    }

    var l = values.length,
        retV = [];

    for (var i = 0; i < l; i++) {
      retV.push(recurseArray(values[i], singleValFxn, createFn));
    }

    return retV;
  } // state of art recursive array equalising

  function flattenOperation(ovs, nvs, equaliser, removeFxn, addFxn, shouldCreate, createFn) {
    var oldValues = ovs;
    var newValues = nvs;
    var newL = newValues.length;
    var oldL = oldValues.length;
    var returnValues = new Array(newL); // Lesser now

    if (oldL > newL) {
      var _i = oldL - 1;

      while (_i > newL - 1) {
        recurseArray(oldValues[_i], removeFxn);
        _i--;
      }
    }

    var i = 0; // Make old children equal to new children

    while (i < oldL && i < newL) {
      var ov = oldValues[i];
      var nv = newValues[i];

      if (!Array.isArray(ov) && !Array.isArray(nv)) {
        returnValues[i] = equaliser(ov, nv);
      } else if (Array.isArray(ov) && Array.isArray(nv)) {
        returnValues[i] = flattenOperation(ov, nv, equaliser, removeFxn, addFxn, shouldCreate, createFn);
      } else if (Array.isArray(ov) && !Array.isArray(nv)) {
        returnValues[i] = flattenOperation(ov, [nv], equaliser, removeFxn, addFxn, shouldCreate, createFn)[0];
      } else if (!Array.isArray(ov) && Array.isArray(nv)) {
        returnValues[i] = flattenOperation([ov], nv, equaliser, removeFxn, addFxn, shouldCreate, createFn);
      }

      i++;
    } // Add extra new children


    while (i < newL) {
      returnValues[i] = recurseArray(newValues[i], addFxn, createFn);
      i++;
    }

    return returnValues;
  }
  function flatLastElement(vs) {
    var values = vs;
    var i = values.length - 1,
        last,
        lastArray;

    while (last === undefined && i > -1) {
      lastArray = values[i];

      while (lastArray && last === undefined) {
        if (Array.isArray(lastArray)) {
          lastArray = lastArray[lastArray.length - 1];
        } else {
          last = lastArray;
        }
      }

      i--;
    }

    return last;
  }

  (function (SifrrBindType) {
    SifrrBindType[SifrrBindType["Text"] = 1] = "Text";
    SifrrBindType[SifrrBindType["Prop"] = 2] = "Prop";
    SifrrBindType[SifrrBindType["DirectProp"] = 3] = "DirectProp";
    SifrrBindType[SifrrBindType["Attribute"] = 4] = "Attribute";
  })(exports.SifrrBindType || (exports.SifrrBindType = {}));

  const types = {};

  const types$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    get SifrrBindType () { return exports.SifrrBindType; },
    'default': types
  });

  // based on https://github.com/Freak613/stage0/blob/master/index.js
  var TW_SHARED = TREE_WALKER(document);

  function collectValues(element, bindMap) {
    var oldValues = new Array(bindMap.length);

    for (var j = bindMap.length - 1; j > -1; --j) {
      var binding = bindMap[j];

      if (binding.type === exports.SifrrBindType.Text) {
        oldValues[j] = [element];
      } else if (binding.type === exports.SifrrBindType.Attribute) {
        oldValues[j] = null;
      } else if (binding.type === exports.SifrrBindType.Prop) {
        if (binding.name === 'style') {
          oldValues[j] = Object.create(null);
        } else {
          oldValues[j] = null;
        }
      }
    }

    return oldValues;
  }

  function collect(element, refMap) {
    var l = refMap.length,
        refs = new Array(l);
    TW_SHARED.currentNode = element;

    for (var i = 0, n; i < l; i++) {
      n = refMap[i].idx;

      while (--n) {
        element = TW_SHARED.nextNode();
      }

      refs[i] = {
        node: element,
        currentValues: collectValues(element, refMap[i].map),
        bindMap: refMap[i].map,
        bindingSet: new Array(l)
      };
    }

    return refs;
  }
  function create(mainNode, fxn, passedValue) {
    var TW = TREE_WALKER(mainNode);
    var indices = [];
    var map,
        idx = 0,
        ntr,
        node = mainNode; // TW.currentNode = node;

    while (node) {
      if (node !== mainNode && node.nodeType === TEXT_NODE && node.data.trim() === '') {
        ntr = node;
        node = TW.nextNode();
        ntr.remove && ntr.remove();
      } else {
        if (map = fxn(node, passedValue)) {
          indices.push({
            idx: idx + 1,
            map
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
  function cleanEmptyNodes(node) {
    var TW = TREE_WALKER(node);
    var ntr;

    while (node) {
      if (node.nodeType === TEXT_NODE && node.data.trim() === '') {
        ntr = node;
        node = TW.nextNode();
        ntr.remove && ntr.remove();
      } else {
        node = TW.nextNode();
      }
    }
  }

  // Attribute related gotchas
  const updateAttribute = ((element, name, newValue) => {
    if (newValue === false || newValue === null || newValue === undefined) element.hasAttribute(name) && element.removeAttribute(name);else if (name === 'class') element.className = newValue;else if ((name === 'id' || name === 'value') && element[name] !== newValue) element[name] = newValue;else if (element.getAttribute(name) !== newValue) element.setAttribute(name, newValue);
  });

  function attrToProp(attrName) {
    return attrName.substr(1).replace(/-([a-z])/g, g => g[1].toUpperCase());
  }

  var creator = (el, functionMap) => {
    // TEXT/COMMENT Node
    if (el.nodeType === TEXT_NODE || el.nodeType === COMMENT_NODE) {
      var textEl = el;
      var x = textEl.data;
      var xTrim = textEl.data.trim();
      var exactMatch = xTrim.match(REF_REG_EXACT);

      if (exactMatch) {
        textEl.data = '';
        return [{
          type: exports.SifrrBindType.Text,
          value: functionMap.get(exactMatch[1])
        }];
      }

      var middleMatch = x.match(REF_REG);

      if (middleMatch) {
        if (textEl.nodeType === COMMENT_NODE) {
          console.error('Bindings in middle of comments are not supported and will be ignored.');
          return 0;
        }

        if (middleMatch.index === 0) {
          textEl.splitText(REF_LENGTH);
          textEl.data = '';
          return [{
            type: exports.SifrrBindType.Text,
            value: functionMap.get(middleMatch[1])
          }];
        } else {
          textEl.splitText(middleMatch.index);
        }
      }

      return 0;
    } // ELEMENT Node


    if (el.nodeType === ELEMENT_NODE) {
      var eln = el;
      var bm = []; // attributes

      var attrs = Array.prototype.slice.call(eln.attributes),
          l = attrs.length;

      for (var i = 0; i < l; i++) {
        var attribute = attrs[i];

        var _exactMatch = attribute.value.match(REF_REG_EXACT);

        var _middleMatch = attribute.value.match(REF_REG);

        if (!_exactMatch && !_middleMatch) continue;

        if (!_exactMatch && _middleMatch) {
          updateAttribute(eln, attribute.name, attribute.value.replace(REF_REG_GLOBAL, '${__bindingFunction__}'));
          console.error("Binding in between text is not supported in Attribute or Prop. Error in attribute '".concat(attribute.name, "' of element:"));
          console.log(el);
          continue;
        }

        if (attribute.name[0] === ':' && attribute.name[1] === ':') {
          bm.push({
            type: exports.SifrrBindType.DirectProp,
            name: attrToProp(attribute.name).substr(1),
            value: functionMap.get(_middleMatch[1])
          });
        } else if (attribute.name[0] === ':') {
          bm.push({
            type: exports.SifrrBindType.Prop,
            name: attrToProp(attribute.name),
            value: functionMap.get(_middleMatch[1])
          });
        } else {
          bm.push({
            type: exports.SifrrBindType.Attribute,
            name: attribute.name,
            value: functionMap.get(_middleMatch[1])
          });
        }

        updateAttribute(eln, attribute.name, '');
      }

      if (bm.length > 0) return bm;
    }

    return 0;
  };

  var removeFxn = i => i.remove(); // oldChildren array should be continuous childnodes


  function makeChildrenEqual(oldChildren, newChildren, createFn, parent) {
    var lastChild = oldChildren.reference || flatLastElement(oldChildren);
    var nextSib = lastChild && lastChild.nextSibling;
    parent = parent || lastChild.parentNode;

    if (!parent) {
      throw Error('Parent should be present for old children given. Open an issue on sifrr if this is a bug.');
    }

    var reference = oldChildren.reference; // special case of no value return

    if (newChildren.length < 1 && !reference) {
      reference = REFERENCE_COMMENT();
      parent.insertBefore(reference, lastChild);
    }

    var returnValues = flattenOperation(oldChildren, newChildren, makeEqual, removeFxn, i => parent.insertBefore(i, reference || nextSib), i => !!createFn && !isSifrrNode(i), createFn);
    returnValues.reference = reference;
    return returnValues;
  }
  function makeEqual(oldNode, newNode) {
    if (oldNode === newNode) return oldNode;

    if (!newNode.nodeType) {
      update(oldNode, newNode);
      return oldNode;
    } // Text or comment node


    if (oldNode.nodeType === TEXT_NODE && newNode.nodeType === TEXT_NODE || oldNode.nodeType === COMMENT_NODE && newNode.nodeType === COMMENT_NODE) {
      if (oldNode.data !== newNode.data) oldNode.data = newNode.data;
      return oldNode;
    }

    oldNode.replaceWith(newNode);
    return newNode;
  }

  var emptyArray = [];
  function getNodesFromBindingValue(value) {
    if (value === null || value === undefined) {
      return emptyArray;
    } else if (typeof value === 'string') {
      return document.createTextNode(value);
    } else if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        value[i] = getNodesFromBindingValue(value[i]);
      }

      return value;
    } else if (value instanceof HTMLTemplateElement) {
      return Array.prototype.slice.call(value.content.childNodes);
    } else if (value instanceof Node) {
      return value;
    } else if (value instanceof NodeList) {
      return Array.prototype.slice.call(value);
    } else {
      return document.createTextNode(value.toString());
    }
  }

  var emptyObj = Object.freeze(Object.create(null));
  function update(tempElement, props) {
    if (Array.isArray(tempElement)) {
      var l = tempElement.length;

      for (var i = 0; i < l; i++) {
        update(tempElement[i], props);
      }

      return;
    }

    var {
      __sifrrRefs: refs
    } = tempElement;
    if (!props || !refs) return; // Update nodes

    var _loop = function (_i) {
      var {
        node,
        bindMap,
        currentValues,
        bindingSet
      } = refs[_i];
      var hasOnPropChange = typeof node.onPropChange === 'function';
      var hasUpdate = typeof node.update === 'function';
      var promise = false;

      var _loop2 = function (j) {
        var binding = bindMap[j]; // special direct props (events/style)

        if (binding.type === exports.SifrrBindType.DirectProp) {
          if (!bindingSet[j]) {
            bindingSet[j] = true;

            if (binding.name === 'style') {
              var newValue = binding.value || emptyObj;
              var keys = Object.keys(newValue),
                  len = keys.length;

              for (var _i2 = 0; _i2 < len; _i2++) {
                node.style[keys[_i2]] = "".concat(newValue[keys[_i2]]); // remove undefined with empty string
              }
            } else node[binding.name] = binding.value;
          }

          return "continue";
        }

        var oldValue = currentValues[j];

        if (oldValue instanceof Promise) {
          promise = true;
          currentValues[j] = oldValue.then(oldv => {
            var newValue = binding.value(props, oldv);

            if (newValue instanceof Promise) {
              return newValue.then(nv => updateOne(node, binding, oldv, nv, hasOnPropChange));
            } else {
              return updateOne(node, binding, oldv, newValue, hasOnPropChange);
            }
          });
        } else {
          var _oldValue = currentValues[j];

          var _newValue = binding.value(props, _oldValue);

          if (_newValue instanceof Promise) {
            promise = true;
            currentValues[j] = _newValue.then(nv => updateOne(node, binding, _oldValue, nv, hasOnPropChange));
          } else {
            currentValues[j] = updateOne(node, binding, _oldValue, _newValue, hasOnPropChange);
          }
        }
      };

      for (var j = bindMap.length - 1; j > -1; --j) {
        var _ret = _loop2(j);

        if (_ret === "continue") continue;
      }

      if (hasUpdate) {
        promise ? Promise.all(currentValues).then(() => node.update()) : node.update();
      }
    };

    for (var _i = refs.length - 1; _i > -1; --_i) {
      _loop(_i);
    }
  }

  function updateOne(node, binding, oldValue, newValue, hasOnPropChange) {
    // text
    if (binding.type === exports.SifrrBindType.Text) {
      if (oldValue === newValue) return oldValue; // fast path for one text node

      if (oldValue.length === 1 && oldValue[0].nodeType === TEXT_NODE) {
        if (typeof newValue === 'string' || typeof newValue === 'number') {
          if (oldValue[0].data !== newValue.toString()) oldValue[0].data = newValue; // important to use toString

          return oldValue;
        }
      } // fast path for pre-rendered


      if (newValue && newValue.isRendered) {
        return newValue;
      } // convert nodeList/HTML collection to array and string/undefined/null to text element


      var nodes = getNodesFromBindingValue(newValue);
      newValue = makeChildrenEqual(oldValue, Array.isArray(nodes) ? nodes : [nodes]);
    } else if (binding.type === exports.SifrrBindType.Attribute) {
      updateAttribute(node, binding.name, newValue);
    } else if (binding.type === exports.SifrrBindType.Prop) {
      // special case for style prop
      if (binding.name === 'style') {
        newValue = newValue || emptyObj;
        var newKeys = Object.keys(newValue),
            oldKeys = Object.keys(oldValue),
            newl = newKeys.length,
            oldl = oldKeys.length;

        for (var i = 0; i < oldl; i++) {
          if (!newValue[oldKeys[i]]) {
            node.style[oldKeys[i]] = ''; // remove if newValue doesn't have that property
          }
        } // add new properties


        for (var _i3 = 0; _i3 < newl; _i3++) {
          if (oldValue[newKeys[_i3]] !== newValue[newKeys[_i3]]) {
            node.style[newKeys[_i3]] = "".concat(newValue[newKeys[_i3]]);
          }
        }
      } else {
        oldValue = node[binding.name];
        node[binding.name] = newValue;
      }

      if (oldValue !== newValue && hasOnPropChange) node.onPropChange(binding.name, oldValue, newValue);
    }

    return newValue;
  }

  var tempNum = 1;

  var createTemplate = (str, ...substitutions) => {
    var {
      functionMap,
      mergedString
    } = functionMapCreator(str, substitutions);
    var template = createTemplateFromString(mergedString);
    cleanEmptyNodes(template.content);
    var childNodes = Array.prototype.slice.call(template.content.childNodes),
        nodeLength = childNodes.length;
    var refMaps = childNodes.map((cn, i) => {
      // special case of binding in topmost element
      if (cn.nodeType === TEXT_NODE && cn.data.match(REF_REG)) {
        var newFragment = SIFRR_FRAGMENT();
        cn.replaceWith(newFragment);
        newFragment.appendChild(cn);
        childNodes[i] = newFragment;
      }

      var refs = create(childNodes[i], creator, functionMap);
      return refs;
    });
    var tempNums = childNodes.map(() => tempNum++);

    var clone = props => {
      // https://jsbench.me/6qk4zc0s9x/1
      var newNodes = new Array(nodeLength);

      for (var i = 0; i < nodeLength; i++) {
        newNodes[i] = childNodes[i].cloneNode(true);
        newNodes[i].__tempNum = tempNums[i];
        if (refMaps[i].length < 1) continue;
        newNodes[i].__sifrrRefs = collect(newNodes[i], refMaps[i]);
        update(newNodes[i], props);
      }

      return newNodes;
    }; // cloning this template, can be used as binding function in another template


    var createFxn = (props, oldValue) => {
      if (oldValue) {
        if (isSameSifrrNode(oldValue, tempNums)) {
          oldValue.forEach(ov => update(ov, props));
          oldValue.isRendered = true;
          return oldValue;
        } else if (!Array.isArray(oldValue)) {
          console.warn("oldValue given to Component function was not an Array.\n        template: `".concat(String.raw(str, ...substitutions), "`"));
        } else if (oldValue.length == 1 && oldValue[0].nodeType === TEXT_NODE) ; else if (oldValue.length > 0) {
          console.warn("oldValue given to Component function was not created by this Component. \n        This might be a bug or caused if you return different \n        components in same binding function.\n        old nodes given: ".concat(oldValue, "\n        template: `").concat(String.raw(str, ...substitutions), "`"));
        }
      }

      return clone(props);
    };

    return createFxn;
  };

  function css(str, ...substitutions) {
    var raw = [...str.raw];
    raw.unshift('<style>');
    raw.push('</style>');
    raw.raw = raw;
    return createTemplate(raw, '', ...substitutions, '');
  }

  function bindFor (template, data = [], oldValue) {
    var ret = makeChildrenEqual(oldValue, data, template);
    ret.isRendered = true;
    return ret;
  }

  /* eslint-disable max-lines */
  // This is almost straightforward implementation of reconcillation algorithm
  // based on ivi documentation:
  // https://github.com/localvoid/ivi/blob/2c81ead934b9128e092cc2a5ef2d3cabc73cb5dd/packages/ivi/src/vdom/implementation.ts#L1366
  // With some fast paths from Surplus implementation:
  // https://github.com/adamhaile/surplus/blob/master/src/runtime/content.ts#L86
  //
  // How this implementation differs from others, is that it's working with data directly,
  // without maintaining nodes arrays, and manipulates dom only when required
  // only works with data nodes
  // TODO: cleanup

  function makeChildrenEqualKeyed(oldChildren, newData, createFn) {
    var newL = newData.length,
        oldL = oldChildren.length;
    var lastChild = oldChildren.reference || flatLastElement(oldChildren);
    var nextSib = lastChild && lastChild.nextSibling;
    var parent = lastChild.parentNode;
    var returnNodes = new Array(newL);

    if (!parent) {
      throw Error('Parent should be given of there were no Child Nodes Before. Open an issue on sifrr/sifrr if you think this is a bug.');
    }

    returnNodes.reference = oldChildren.reference; // special case of no value return

    if (returnNodes.length < 1 && !returnNodes.reference) {
      var referenceComment = document.createComment('Sifrr Reference Comment. Do not delete.');
      returnNodes.reference = referenceComment;
      parent.insertBefore(referenceComment, lastChild);
    }

    if (oldL === 0) {
      for (var i = 0; i < newL; i++) {
        var n = createFn(newData[i])[0];
        n.key = newData[i].key;
        returnNodes[i] = n;
        parent.insertBefore(n, nextSib);
      }

      return returnNodes;
    } // reconciliation


    var prevStart = 0,
        newStart = 0,
        loop = true,
        prevEnd = oldL - 1,
        newEnd = newL - 1,
        prevStartNode = oldChildren[0],
        prevEndNode = oldChildren[oldL - 1],
        finalNode,
        a,
        b,
        _node;

    fixes: while (loop) {
      loop = false; // Skip prefix

      a = prevStartNode, b = newData[newStart];

      while (b && a.key === b.key) {
        returnNodes[newStart] = makeEqual(prevStartNode, b);
        prevStart++;
        prevStartNode = prevStartNode.nextSibling;
        newStart++;
        if (prevEnd < prevStart || newEnd < newStart) break fixes;
        a = prevStartNode, b = newData[newStart];
      } // Skip suffix


      a = prevEndNode, b = newData[newEnd];

      while (b && a.key === b.key) {
        returnNodes[newEnd] = makeEqual(prevEndNode, b);
        prevEnd--;
        finalNode = prevEndNode;
        prevEndNode = prevEndNode.previousSibling;
        newEnd--;
        if (prevEnd < prevStart || newEnd < newStart) break fixes;
        a = prevEndNode, b = newData[newEnd];
      } // Fast path to swap backward


      a = prevEndNode, b = newData[newStart];

      while (b && a.key === b.key) {
        loop = true;
        returnNodes[newStart] = makeEqual(prevEndNode, b);
        _node = prevEndNode.previousSibling;
        parent.insertBefore(prevEndNode, prevStartNode);
        prevEndNode = _node;
        prevEnd--;
        newStart++;
        if (prevEnd < prevStart || newEnd < newStart) break fixes;
        a = prevEndNode, b = newData[newStart];
      } // Fast path to swap forward


      a = prevStartNode, b = newData[newEnd];

      while (b && a.key === b.key) {
        loop = true;
        returnNodes[newEnd] = makeEqual(prevStartNode, b);
        _node = prevStartNode.nextSibling;
        parent.insertBefore(prevStartNode, prevEndNode.nextSibling);
        finalNode = prevStartNode;
        prevEndNode = prevStartNode.previousSibling;
        prevStartNode = _node;
        prevStart++;
        newEnd--;
        if (prevEnd < prevStart || newEnd < newStart) break fixes;
        a = prevStartNode, b = newData[newEnd];
      }
    } // Fast path for shrink


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

      return returnNodes;
    } // Fast path for add


    if (prevEnd < prevStart) {
      if (newStart <= newEnd) {
        while (newStart <= newEnd) {
          _node = createFn(newData[newStart])[0];
          _node.key = newData[newStart].key;
          returnNodes[newStart] = _node;
          parent.insertBefore(_node, finalNode);
          newStart++;
        }
      }

      return returnNodes;
    }

    var oldKeys = new Array(newEnd + 1 - newStart),
        newKeys = new Map(),
        nodes = new Array(prevEnd - prevStart + 1),
        toDelete = [];

    for (var _i = newStart; _i <= newEnd; _i++) {
      // Positions for reusing nodes from current DOM state
      oldKeys[_i] = -1; // Index to resolve position from current to new

      newKeys.set(newData[_i].key, _i);
    }

    var reusingNodes = 0;

    while (prevStart <= prevEnd) {
      if (newKeys.has(prevStartNode.key)) {
        oldKeys[newKeys.get(prevStartNode.key)] = prevStart;
        reusingNodes++;
      } else {
        toDelete.push(prevStartNode);
      }

      nodes[prevStart] = prevStartNode;
      prevStartNode = prevStartNode.nextSibling;
      prevStart++;
    } // Remove extra nodes


    for (var _i2 = 0; _i2 < toDelete.length; _i2++) {
      parent.removeChild(toDelete[_i2]);
    } // Fast path for full replace


    if (reusingNodes === 0) {
      for (var _i3 = newStart; _i3 <= newEnd; _i3++) {
        // Add extra nodes
        returnNodes[_i3] = createFn(newData[_i3])[0];
        returnNodes[_i3].key = newData[_i3].key;
        parent.insertBefore(returnNodes[_i3], prevStartNode);
      }

      return returnNodes;
    }

    var longestSeq = longestPositiveIncreasingSubsequence(oldKeys, newStart);
    var lisIdx = longestSeq.length - 1,
        tmpD;

    for (var _i4 = newEnd; _i4 >= newStart; _i4--) {
      if (longestSeq[lisIdx] === _i4) {
        finalNode = nodes[oldKeys[_i4]];
        returnNodes[_i4] = finalNode; // returnNodes[i] = finalNode; reused nodes, not needed to set key

        makeEqual(finalNode, newData[_i4]);
        lisIdx--;
      } else {
        if (oldKeys[_i4] === -1) {
          tmpD = createFn(newData[_i4])[0];
          tmpD.key = newData[_i4].key;
        } else {
          tmpD = nodes[oldKeys[_i4]];
          makeEqual(tmpD, newData[_i4]);
        }

        returnNodes[_i4] = tmpD;
        parent.insertBefore(tmpD, finalNode);
        finalNode = tmpD;
      }
    }

    return returnNodes;
  } // Picked from
  // https://github.com/adamhaile/surplus/blob/master/src/runtime/content.ts#L368
  // return an array of the indices of ns that comprise the longest increasing subsequence within ns

  function longestPositiveIncreasingSubsequence(ns, newStart) {
    var seq = [],
        is = [],
        pre = new Array(ns.length);
    var l = -1;

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
    // invariant: lo is guaranteed to be index of a value <= n, hi to be >
    // therefore, they actually start out of range: (-1, last + 1)
    var lo = -1,
        hi = seq.length; // fast path for simple increasing sequences

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

  function bindForKeyed (template, data = [], oldValue) {
    var ret = makeChildrenEqualKeyed(oldValue, data, template);
    ret.isRendered = true;
    return ret;
  }

  function memo(fxn, deps = []) {
    var isFunc = typeof deps === 'function';
    var depsL = !isFunc && deps.length;
    var memoValues = new Map();
    return (props, oldValue) => {
      var memoMap;

      if (memoValues.has(props)) {
        memoMap = memoValues.get(props);
      } else {
        memoMap = new Map();
        memoValues.set(props, memoMap);
      }

      var memoKey;

      if (isFunc) {
        memoKey = deps(props);
      } else {
        for (var i = 0; i < depsL; i++) {
          memoKey = memoKey ? "".concat(memoKey, "_").concat(props[deps[i]]) : props[deps[i]];
        }
      }

      if (!memoMap.has(memoKey)) {
        memoMap.set(memoKey, fxn(props, oldValue));
      }

      return memoMap.get(memoKey);
    };
  }

  class Store {
    constructor(initialValue) {
      this.listeners = [];
      this.value = initialValue;
    }

    set(newValue) {
      this.value = newValue;
      this.onUpdate();
    }

    addListener(fxn) {
      this.listeners.push(fxn);
    }

    onUpdate() {
      this.listeners.forEach(listener => listener(this));
    }

  }

  const sifrr_template = Object.assign({
    createUniqueString,
    createTemplateFromString,
    makeChildrenEqual,
    html: createTemplate,
    css,
    update,
    bindFor,
    bindForKeyed,
    memo,
    Store,
    makeEqualArray: makeChildrenEqual,
    makeEqual
  }, types$1);

  exports.Store = Store;
  exports.bindFor = bindFor;
  exports.bindForKeyed = bindForKeyed;
  exports.createTemplateFromString = createTemplateFromString;
  exports.createUniqueString = createUniqueString;
  exports.css = css;
  exports.default = sifrr_template;
  exports.html = createTemplate;
  exports.makeEqual = makeEqual;
  exports.makeEqualArray = makeChildrenEqual;
  exports.memo = memo;
  exports.update = update;

  if (exports.default) exports = exports.default;

  return exports;

}({}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrr.template.js.map
