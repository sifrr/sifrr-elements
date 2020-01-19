/*! Sifrr.Dom v0.0.6 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr */
this.Sifrr = this.Sifrr || {};
this.Sifrr.Dom = (function (exports, template) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0
    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.
    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    function __rest(s, e) {
      var t = {};
      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
      }
      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }

    // Inspired from https://github.com/Freak6133/stage0/blob/master/syntheticEvents.js
    var SYNTHETIC_EVENTS = Object.create(null);
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
            eventHandler.call(window, e, target);
          } else if (typeof eventHandler === 'string') {
            new Function('event', 'target', eventHandler).call(window, event, target);
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
      SYNTHETIC_EVENTS[name] = Object.create(null);
      return true;
    };
    var addListener = (name, css, fxn) => {
      add(name);

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
      el.dispatchEvent(new CustomEvent(name, Object.assign(options || {}, customOpts, options)));
    };

    const Event = /*#__PURE__*/Object.freeze({
        __proto__: null,
        all: SYNTHETIC_EVENTS,
        getEventListener: getEventListener,
        add: add,
        addListener: addListener,
        removeListener: removeListener,
        trigger: trigger
    });

    function elementClassFactory(baseClass) {
      var _a;

      return _a = class SifrrElement extends baseClass {
        constructor() {
          super();
          this.__content = [];
          this.connected = false;
          var constructor = this.constructor;
          var temp = constructor.ctemp();

          if (temp) {
            this.__content = temp(null);

            if (constructor.useShadowRoot) {
              this.attachShadow({
                mode: 'open'
              });
              this.shadowRoot.append(...this.__content);
            }
          }
        }

        static extends(htmlElementClass) {
          return elementClassFactory(htmlElementClass);
        }

        static get elementName() {
          return this._elName || (this._elName = this.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), this._elName);
        }

        static ctemp() {
          if (this._ctemp) return this._ctemp;
          this._ctemp = this.template;
          return this._ctemp;
        }

        connectedCallback() {
          this.connected = true;

          if (!this.shadowRoot && this.__content.length > 0) {
            if (this.childNodes.length !== 0) this.textContent = '';
            this.append(...this.__content);
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

        onAttributeChange(_name, _oldVal, _newVal) {}

        setProps(props) {
          Object.keys(props).forEach(prop => {
            this[prop] = props[prop];
          });
          this.connected && this.update();
        }

        onPropChange(prop, oldVal, newVal) {}

        setState(v) {
          if (this.state !== v) this.state = Object.assign({}, this.state, v);
          this.update();
          this.onStateChange();
        }

        onStateChange() {}

        update() {
          this.beforeUpdate();
          template.update(this.__content, this);
          trigger(this, 'update', {
            detail: {
              state: this.state
            }
          });
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

      }, _a.useShadowRoot = true, _a.template = null, _a.defaultState = null, _a;
    }

    const Element = elementClassFactory(window.HTMLElement);

    const config = {
      events: ['input', 'change', 'update'],
      urls: {},
      url: null
    };

    class Loader {
      constructor(elemName, url) {
        if (!fetch) throw Error('Sifrr.Dom.load requires window.fetch API to work.');
        if (this.constructor.all[elemName]) return this.constructor.all[elemName];
        this.elementName = elemName;
        this.constructor.all[this.elementName] = this;
        this.url = url;
      }

      executeScripts() {
        this._exec = this._exec || Promise.resolve(null).then(() => this.constructor.executeJS(this.getUrl())).catch(e => {
          console.error(e);
          console.log("File for '".concat(this.elementName, "' gave error."));
        });
        return this._exec;
      }

      getUrl() {
        if (this.url) return this.url;
        if (config.urls[this.elementName]) return config.urls[this.elementName];
        if (typeof config.url === 'function') return config.url(this.elementName);
        throw Error("Can not get url for element: ".concat(this.elementName, ". Provide url in load or set urls or url function in config."));
      }

      static getFile(url) {
        return window.fetch(url).then(resp => resp.text());
      }

      static executeJS(url) {
        return this.getFile(url).then(script => {
          return new Function(script + "\n //# sourceURL=".concat(url)).call(window);
        });
      }

    }

    Loader.all = {};

    function createElement(elementClass, props, oldElement) {
      if (oldElement instanceof elementClass) {
        oldElement.setProps(props);
        return oldElement;
      } else {
        var element = document.createElement(elementClass.elementName);
        element.setProps(props);
        return element;
      }
    }

    const types = {};

    const types$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': types
    });

    var elements = Object.create(null);
    var loadingElements = Object.create(null);
    var registering = Object.create(null); // Register Custom Element Function

    function register(Element, _a = {}) {
      var {
        name,
        dependsOn
      } = _a,
          options = __rest(_a, ["name", "dependsOn"]);

      name = name || Element.elementName;

      if (!name) {
        return Promise.reject(Error('Error creating Custom Element: No name given.'));
      } else if (window.customElements.get(name)) {
        console.warn("Error creating Element: ".concat(name, " - Custom Element with this name is already defined."));
        return Promise.resolve(false);
      } else if (name.indexOf('-') < 1) {
        return Promise.reject(Error("Error creating Element: ".concat(name, " - Custom Element name must have one hyphen '-'")));
      } else {
        var before;

        if (Array.isArray(dependsOn)) {
          before = Promise.all(dependsOn.map(en => load(en)));
        } else if (typeof dependsOn === 'string') {
          before = load(dependsOn);
        } else if (typeof before === 'object' && before !== null) {
          before = Promise.all(Object.keys(dependsOn).map(k => load(k, dependsOn[k])));
        } else before = Promise.resolve(true);

        var registeringPromise = before.then(() => window.customElements.define(name, Element, options));
        registering[name] = registeringPromise;
        return registeringPromise.then(() => {
          elements[name] = Element;
          delete registering[name];
        }).catch(error => {
          throw Error("Error creating Custom Element: ".concat(name, " - ").concat(error.message));
        });
      }
    } // Initialize SifrrDom


    function setup(newConfig) {
      HTMLElement.prototype.$ = HTMLElement.prototype.querySelector;
      HTMLElement.prototype.$$ = HTMLElement.prototype.querySelectorAll;
      document.$ = document.querySelector;
      document.$$ = document.querySelectorAll;
      Object.assign(config, newConfig);
      config.events.forEach(e => add(e));
    } // Load Element HTML/JS and execute script in it


    function load(elemName, url = null) {
      if (window.customElements.get(elemName)) {
        return Promise.resolve();
      }

      loadingElements[elemName] = window.customElements.whenDefined(elemName);
      var loader = new Loader(elemName, url);
      return loader.executeScripts().then(() => registering[elemName]).then(() => {
        if (!window.customElements.get(elemName)) {
          window.console.warn("Executing '".concat(loader.getUrl(), "' file didn't register the element with name '").concat(elemName, "'. Give correct name to 'load' or fix the file."));
        }
      }).finally(() => {
        delete registering[elemName];
        delete loadingElements[elemName];
      });
    }

    var loading = () => {
      var promises = [];

      for (var el in loadingElements) {
        promises.push(loadingElements[el]);
      }

      return Promise.all(promises);
    };
    const sifrr_dom = Object.assign({
      Element,
      Loader,
      Event,
      register,
      setup,
      load,
      loading,
      config,
      elements,
      createElement
    }, types$1);

    exports.Element = Element;
    exports.Event = Event;
    exports.Loader = Loader;
    exports.config = config;
    exports.createElement = createElement;
    exports.default = sifrr_dom;
    exports.elements = elements;
    exports.load = load;
    exports.loading = loading;
    exports.register = register;
    exports.setup = setup;

    if (exports.default) exports = exports.default;

    return exports;

}({}, Sifrr.Template));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrr.dom.js.map
