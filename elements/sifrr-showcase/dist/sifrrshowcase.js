/*! SifrrShowcase v0.0.5 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@sifrr/dom'), require('@sifrr/storage')) :
  typeof define === 'function' && define.amd ? define(['@sifrr/dom', '@sifrr/storage'], factory) :
  (global = global || self, global.SifrrShowcase = factory(global.Sifrr.Dom, global.Sifrr.Storage));
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

  var css = "* {\n  box-sizing: border-box; }\n\n.font {\n  font-family: Roboto, Ariel; }\n\n.container {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-wrap: nowrap;\n  background-color: #3a3f5a; }\n\n#sidemenu {\n  width: 15%;\n  height: 100%; }\n\n#sidemenu > * {\n  height: 100%; }\n\nsifrr-single-showcase {\n  width: 85%;\n  height: 100%;\n  display: block; }\n\n#sidebar {\n  width: 30%;\n  height: 100%; }\n\n#sidebar > * {\n  height: 33.33%; }\n\n#main {\n  width: 70%;\n  height: 100%; }\n\n.current {\n  background: #5f616d; }\n\n.flex-column {\n  height: 100%;\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: column; }\n\n.box {\n  width: 100%;\n  overflow: scroll;\n  border: 1px solid #5f616d; }\n\n#element {\n  padding: 20px;\n  height: 70%; }\n\n#code {\n  height: 30%; }\n\n#code sifrr-code-editor {\n  height: calc(100% - 48px) !important; }\n\n.head {\n  color: #cccccc;\n  text-align: center; }\n\n.small {\n  color: #8f9cb3;\n  font-size: 16px;\n  line-height: 24px;\n  padding: 4px; }\n\n#error,\n#status {\n  color: red; }\n\nsifrr-code-editor {\n  height: calc(100% - 24px); }\n\nul {\n  padding: 8px;\n  margin: 0; }\n\n#variants {\n  height: calc(100% - 86px);\n  overflow-y: scroll; }\n\n.variant,\n.showcase {\n  list-style-type: none;\n  border-bottom: 1px solid #5f616d; }\n  .variant span,\n  .showcase span {\n    color: red;\n    float: right;\n    margin-right: 10px; }\n\n#saver,\n#loader {\n  color: green;\n  padding: 4px;\n  margin: 0; }\n\nbutton,\n.button {\n  position: relative;\n  display: inline-block;\n  background: #cccccc;\n  border: 1px solid grey;\n  color: #3a3f5a;\n  font-size: 14px;\n  padding: 4px; }\n  button input,\n  .button input {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    opacity: 0; }\n";

  const html = "<div class=\"container\">\n  <div class=\"flex-column\" id=\"sidebar\">\n    <div class=\"box\">\n      <h3 class=\"font head\">Variants</h3>\n      <input id=\"variantName\" type=\"text\" name=\"variantName\" value=\"${this.state.variantName}\" data-sifrr-bind=\"variantName\">\n      <button class=\"font\" type=\"button\" name=\"createVariant\" _click=\"${this.createNewVariant}\">\n        Create new variant\n      </button>\n      <style media=\"screen\">\n        #variant${this.state.variantId} {\n          background: #5f616d;\n        }\n      </style>\n      <div id=\"variants\">\n        <div data-sifrr-repeat=\"${this.state.variants}\">\n          <li class=\"font variant small\" data-variant-id=\"${this.state.variantId}\" id=\"variant${this.state.variantId}\">\n            ${this.state.variantName}<span>X</span>\n          </li>\n        </div>\n      </div>\n    </div>\n    <div class=\"box\">\n      <label class=\"font small\" for=\"style\">Element CSS Styles</label>\n      <sifrr-code-editor lang=\"css\" data-sifrr-bind=\"style\" value=\"${this.state.style}\"></sifrr-code-editor>\n    </div>\n    <div class=\"box\">\n      <label class=\"font small\" for=\"elState\">Element State Function</label>\n      <sifrr-code-editor id=\"elState\" lang=\"javascript\" data-sifrr-bind=\"elState\" value=\"${this.state.elState}\"></sifrr-code-editor>\n    </div>\n  </div>\n  <div class=\"flex-column\" id=\"main\">\n    <div class=\"box\" id=\"element\" data-sifrr-html=\"true\">\n      ${this.state.code}\n    </div>\n    <div class=\"box\" id=\"code\">\n      <label class=\"font small\" for=\"elementName\">Element Name</label>\n      <input type=\"text\" name=\"elementName\" placeholder=\"Enter element name here...\" _input=\"${this.updateHtml}\" value=\"${this.state.element}\">\n      <label class=\"font small\" for=\"customUrl\">Custom Url</label>\n      <input type=\"text\" name=\"customUrl\" placeholder=\"Enter element url here...\" value=\"${this.state.elementUrl}\" data-sifrr-bind=\"elementUrl\">\n      <label class=\"font small\" for=\"elementName\">Is JS File</label>\n      <select id=\"isjs\" name=\"isjs\" value=\"${this.state.isjs}\" data-sifrr-bind=\"isjs\">\n        <option value=\"true\">true</option>\n        <option value=\"false\">false</option>\n      </select>\n      <span class=\"font\" id=\"error\"></span>\n      <br>\n      <label class=\"font small\" for=\"htmlcode\">HTML Code</label>\n      <sifrr-code-editor data-sifrr-bind=\"code\" value=\"${this.state.code}\"></sifrr-code-editor>\n    </div>\n  </div>\n</div>\n";

  var css$1 = ":host {\n  display: block;\n  position: relative; }\n\n* {\n  box-sizing: border-box; }\n\ntextarea {\n  resize: none;\n  border: none; }\n\ntextarea,\n.CodeMirror {\n  height: 100%;\n  width: 100%; }\n";

  function _templateObject() {
    const data = _taggedTemplateLiteral(["\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/codemirror@", "/lib/codemirror.css\">\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/codemirror@", "/theme/${this.getTheme()}.css\">\n<style media=\"screen\">\n  ", "\n</style>\n<textarea></textarea>"], ["\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/codemirror@", "/lib/codemirror.css\">\n<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/codemirror@", "/theme/\\${this.getTheme()}.css\">\n<style media=\"screen\">\n  ", "\n</style>\n<textarea></textarea>"]);
    _templateObject = function () {
      return data;
    };
    return data;
  }
  const CM_VERSION = '5.48.0';
  const template = SifrrDom.template(_templateObject(), CM_VERSION, CM_VERSION, css$1);
  class SifrrCodeEditor extends SifrrDom.Element {
    static get template() {
      return template;
    }
    static observedAttrs() {
      return ['value', 'theme', 'lang'];
    }
    static syncedAttrs() {
      return ['theme'];
    }
    static cm() {
      this._cm = this._cm || SifrrDom.Loader.executeJS("https://cdn.jsdelivr.net/npm/codemirror@".concat(CM_VERSION, "/lib/codemirror.js"));
      return this._cm;
    }
    onAttributeChange(n, _, v) {
      if (this._cmLoaded) {
        if (n === 'theme') this.cm.setOption('theme', v);
        if (n === 'lang') this.cm.setOption('mode', this.getTheme());
      }
    }
    onConnect() {
      this.constructor.cm().then(() => this.cmLoaded());
    }
    input() {
      SifrrDom.Event.trigger(this, 'input');
      this.update();
    }
    cmLoaded() {
      SifrrDom.Loader.executeJS("https://cdn.jsdelivr.net/npm/codemirror@".concat(CM_VERSION, "/mode/").concat(this.lang, "/").concat(this.lang, ".js")).then(() => {
        this.cm = window.CodeMirror.fromTextArea(this.$('textarea'), {
          value: this.$('textarea').value,
          mode: this.lang,
          htmlMode: true,
          theme: this.getTheme(),
          indentUnit: 2,
          tabSize: 2,
          lineNumbers: true
        });
        this.cm.on('change', this.input.bind(this));
        this._cmLoaded = true;
      });
    }
    getTheme() {
      return this.theme ? this.theme.split(' ')[0] : 'dracula';
    }
    get value() {
      if (this._cmLoaded) return this.cm.getValue();else return this.$('textarea').value;
    }
    set value(v) {
      if (v === this.value) return;
      if (this._cmLoaded) return this.cm.setValue(v);else this.$('textarea').value = v;
    }
    get lang() {
      const attr = this.getAttribute('lang');
      if (!attr || attr === 'html') return 'xml';
      return attr;
    }
  }
  SifrrDom.register(SifrrCodeEditor);

  var strictUriEncode = str => encodeURIComponent(str).replace(/[!'()*]/g, x => `%${x.charCodeAt(0).toString(16).toUpperCase()}`);

  var token = '%[a-f0-9]{2}';
  var singleMatcher = new RegExp(token, 'gi');
  var multiMatcher = new RegExp('(' + token + ')+', 'gi');
  function decodeComponents(components, split) {
  	try {
  		return decodeURIComponent(components.join(''));
  	} catch (err) {
  	}
  	if (components.length === 1) {
  		return components;
  	}
  	split = split || 1;
  	var left = components.slice(0, split);
  	var right = components.slice(split);
  	return Array.prototype.concat.call([], decodeComponents(left), decodeComponents(right));
  }
  function decode(input) {
  	try {
  		return decodeURIComponent(input);
  	} catch (err) {
  		var tokens = input.match(singleMatcher);
  		for (var i = 1; i < tokens.length; i++) {
  			input = decodeComponents(tokens, i).join('');
  			tokens = input.match(singleMatcher);
  		}
  		return input;
  	}
  }
  function customDecodeURIComponent(input) {
  	var replaceMap = {
  		'%FE%FF': '\uFFFD\uFFFD',
  		'%FF%FE': '\uFFFD\uFFFD'
  	};
  	var match = multiMatcher.exec(input);
  	while (match) {
  		try {
  			replaceMap[match[0]] = decodeURIComponent(match[0]);
  		} catch (err) {
  			var result = decode(match[0]);
  			if (result !== match[0]) {
  				replaceMap[match[0]] = result;
  			}
  		}
  		match = multiMatcher.exec(input);
  	}
  	replaceMap['%C2'] = '\uFFFD';
  	var entries = Object.keys(replaceMap);
  	for (var i = 0; i < entries.length; i++) {
  		var key = entries[i];
  		input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
  	}
  	return input;
  }
  var decodeUriComponent = function (encodedURI) {
  	if (typeof encodedURI !== 'string') {
  		throw new TypeError('Expected `encodedURI` to be of type `string`, got `' + typeof encodedURI + '`');
  	}
  	try {
  		encodedURI = encodedURI.replace(/\+/g, ' ');
  		return decodeURIComponent(encodedURI);
  	} catch (err) {
  		return customDecodeURIComponent(encodedURI);
  	}
  };

  var splitOnFirst = (string, separator) => {
  	if (!(typeof string === 'string' && typeof separator === 'string')) {
  		throw new TypeError('Expected the arguments to be of type `string`');
  	}
  	if (separator === '') {
  		return [string];
  	}
  	const separatorIndex = string.indexOf(separator);
  	if (separatorIndex === -1) {
  		return [string];
  	}
  	return [
  		string.slice(0, separatorIndex),
  		string.slice(separatorIndex + separator.length)
  	];
  };

  function encoderForArrayFormat(options) {
  	switch (options.arrayFormat) {
  		case 'index':
  			return key => (result, value) => {
  				const index = result.length;
  				if (value === undefined) {
  					return result;
  				}
  				if (value === null) {
  					return [...result, [encode(key, options), '[', index, ']'].join('')];
  				}
  				return [
  					...result,
  					[encode(key, options), '[', encode(index, options), ']=', encode(value, options)].join('')
  				];
  			};
  		case 'bracket':
  			return key => (result, value) => {
  				if (value === undefined) {
  					return result;
  				}
  				if (value === null) {
  					return [...result, [encode(key, options), '[]'].join('')];
  				}
  				return [...result, [encode(key, options), '[]=', encode(value, options)].join('')];
  			};
  		case 'comma':
  			return key => (result, value, index) => {
  				if (value === null || value === undefined || value.length === 0) {
  					return result;
  				}
  				if (index === 0) {
  					return [[encode(key, options), '=', encode(value, options)].join('')];
  				}
  				return [[result, encode(value, options)].join(',')];
  			};
  		default:
  			return key => (result, value) => {
  				if (value === undefined) {
  					return result;
  				}
  				if (value === null) {
  					return [...result, encode(key, options)];
  				}
  				return [...result, [encode(key, options), '=', encode(value, options)].join('')];
  			};
  	}
  }
  function parserForArrayFormat(options) {
  	let result;
  	switch (options.arrayFormat) {
  		case 'index':
  			return (key, value, accumulator) => {
  				result = /\[(\d*)\]$/.exec(key);
  				key = key.replace(/\[\d*\]$/, '');
  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}
  				if (accumulator[key] === undefined) {
  					accumulator[key] = {};
  				}
  				accumulator[key][result[1]] = value;
  			};
  		case 'bracket':
  			return (key, value, accumulator) => {
  				result = /(\[\])$/.exec(key);
  				key = key.replace(/\[\]$/, '');
  				if (!result) {
  					accumulator[key] = value;
  					return;
  				}
  				if (accumulator[key] === undefined) {
  					accumulator[key] = [value];
  					return;
  				}
  				accumulator[key] = [].concat(accumulator[key], value);
  			};
  		case 'comma':
  			return (key, value, accumulator) => {
  				const isArray = typeof value === 'string' && value.split('').indexOf(',') > -1;
  				const newValue = isArray ? value.split(',') : value;
  				accumulator[key] = newValue;
  			};
  		default:
  			return (key, value, accumulator) => {
  				if (accumulator[key] === undefined) {
  					accumulator[key] = value;
  					return;
  				}
  				accumulator[key] = [].concat(accumulator[key], value);
  			};
  	}
  }
  function encode(value, options) {
  	if (options.encode) {
  		return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
  	}
  	return value;
  }
  function decode$1(value, options) {
  	if (options.decode) {
  		return decodeUriComponent(value);
  	}
  	return value;
  }
  function keysSorter(input) {
  	if (Array.isArray(input)) {
  		return input.sort();
  	}
  	if (typeof input === 'object') {
  		return keysSorter(Object.keys(input))
  			.sort((a, b) => Number(a) - Number(b))
  			.map(key => input[key]);
  	}
  	return input;
  }
  function removeHash(input) {
  	const hashStart = input.indexOf('#');
  	if (hashStart !== -1) {
  		input = input.slice(0, hashStart);
  	}
  	return input;
  }
  function extract(input) {
  	input = removeHash(input);
  	const queryStart = input.indexOf('?');
  	if (queryStart === -1) {
  		return '';
  	}
  	return input.slice(queryStart + 1);
  }
  function parse(input, options) {
  	options = Object.assign({
  		decode: true,
  		sort: true,
  		arrayFormat: 'none',
  		parseNumbers: false,
  		parseBooleans: false
  	}, options);
  	const formatter = parserForArrayFormat(options);
  	const ret = Object.create(null);
  	if (typeof input !== 'string') {
  		return ret;
  	}
  	input = input.trim().replace(/^[?#&]/, '');
  	if (!input) {
  		return ret;
  	}
  	for (const param of input.split('&')) {
  		let [key, value] = splitOnFirst(param.replace(/\+/g, ' '), '=');
  		value = value === undefined ? null : decode$1(value, options);
  		if (options.parseNumbers && !Number.isNaN(Number(value))) {
  			value = Number(value);
  		}
  		if (options.parseBooleans && value !== null && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
  			value = value.toLowerCase() === 'true';
  		}
  		formatter(decode$1(key, options), value, ret);
  	}
  	if (options.sort === false) {
  		return ret;
  	}
  	return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
  		const value = ret[key];
  		if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
  			result[key] = keysSorter(value);
  		} else {
  			result[key] = value;
  		}
  		return result;
  	}, Object.create(null));
  }
  var extract_1 = extract;
  var parse_1 = parse;
  var stringify = (object, options) => {
  	if (!object) {
  		return '';
  	}
  	options = Object.assign({
  		encode: true,
  		strict: true,
  		arrayFormat: 'none'
  	}, options);
  	const formatter = encoderForArrayFormat(options);
  	const keys = Object.keys(object);
  	if (options.sort !== false) {
  		keys.sort(options.sort);
  	}
  	return keys.map(key => {
  		const value = object[key];
  		if (value === undefined) {
  			return '';
  		}
  		if (value === null) {
  			return encode(key, options);
  		}
  		if (Array.isArray(value)) {
  			return value
  				.reduce(formatter(key), [])
  				.join('&');
  		}
  		return encode(key, options) + '=' + encode(value, options);
  	}).filter(x => x.length > 0).join('&');
  };
  var parseUrl = (input, options) => {
  	return {
  		url: removeHash(input).split('?')[0] || '',
  		query: parse(extract(input), options)
  	};
  };
  var queryString = {
  	extract: extract_1,
  	parse: parse_1,
  	stringify: stringify,
  	parseUrl: parseUrl
  };

  function getParam(name) {
    return queryString.parse(location.search)[name];
  }
  function setParam(name, value) {
    const newParams = Object.assign(queryString.parse(location.search), {
      [name]: value
    });
    history.replaceState(newParams, 'Title', "".concat(location.pathname, "?").concat(queryString.stringify(newParams)));
  }

  function _templateObject$1() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<style>\n${this.state.style}\n</style>\n", ""], ["<style media=\"screen\">\n  ", "\n</style>\n<style>\n\\${this.state.style}\n</style>\n", ""]);
    _templateObject$1 = function () {
      return data;
    };
    return data;
  }
  const template$1 = SifrrDom.template(_templateObject$1(), css, html);
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
      return template$1;
    }
    static observedAttrs() {
      return ['url'];
    }
    onConnect() {
      this.switchVariant(getParam('variant'));
      SifrrDom.Event.addListener('click', '.variant', (e, el) => {
        if (el.matches('.variant')) this.switchVariant(el.dataset.variantId);
        if (el.matches('.variant span')) this.deleteVariant(el.parentNode.dataset.variantId);
      });
    }
    beforeUpdate() {
      this.saveVariant();
      if (!this.state.element) return;
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
      setParam('variant', id);
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

  function _templateObject$2() {
    const data = _taggedTemplateLiteral(["<style media=\"screen\">\n  ", "\n</style>\n<div class=\"container\">\n  <div class=\"flex-column\" id=\"sidemenu\">\n    <div class=\"box\">\n      <h1 class=\"font head\">Sifrr Showcase</h1>\n      <p class=\"font\" id=\"loader\"></p>\n      <input id=\"url\" type=\"text\" placeholder=\"Enter url here...\" name=\"url\" />\n      <button type=\"button\" name=\"loadUrl\" _click=${this.loadUrl}>Load from url</button>\n      <p class=\"font\" id=\"status\"></p>\n      <span class=\"button font\">\n        Upload File\n        <input type=\"file\" name=\"file\" accept=\"application/json\" _input=\"${this.loadFile}\" />\n      </span>\n      <button class=\"font\" type=\"button\" name=\"saveFile\" _click=\"${this.saveFile}\">Save to File</button>\n      <h3 class=\"font head\">Showcases</h3>\n      <input id=\"showcaseName\" type=\"text\" name=\"showcase\" _input=${this.changeName} value=${this.state.showcases[this.state.current].name}>\n      <button class=\"font\" type=\"button\" name=\"createVariant\" _click=\"${this.createShowcase}\">Create new showcase</button>\n      <div id=\"showcases\" data-sifrr-repeat=\"${this.state.showcases}\">\n        <li class=\"font showcase small ${(this.root && this.state.name === this.root.state.currentSC.name) ? 'current' : ''}\" data-showcase-id=\"${this.state.key}\" draggable=\"true\">${this.state.name}<span>X</span></li>\n      </div>\n    </div>\n  </div>\n  <sifrr-single-showcase _update=${this.saveShowcase} _state=${this.state.currentSC} data-sifrr-bind=\"currentSC\"></sifrr-single-showcase>\n</div>"], ["<style media=\"screen\">\n  ", "\n</style>\n<div class=\"container\">\n  <div class=\"flex-column\" id=\"sidemenu\">\n    <div class=\"box\">\n      <h1 class=\"font head\">Sifrr Showcase</h1>\n      <p class=\"font\" id=\"loader\"></p>\n      <input id=\"url\" type=\"text\" placeholder=\"Enter url here...\" name=\"url\" />\n      <button type=\"button\" name=\"loadUrl\" _click=\\${this.loadUrl}>Load from url</button>\n      <p class=\"font\" id=\"status\"></p>\n      <span class=\"button font\">\n        Upload File\n        <input type=\"file\" name=\"file\" accept=\"application/json\" _input=\"\\${this.loadFile}\" />\n      </span>\n      <button class=\"font\" type=\"button\" name=\"saveFile\" _click=\"\\${this.saveFile}\">Save to File</button>\n      <h3 class=\"font head\">Showcases</h3>\n      <input id=\"showcaseName\" type=\"text\" name=\"showcase\" _input=\\${this.changeName} value=\\${this.state.showcases[this.state.current].name}>\n      <button class=\"font\" type=\"button\" name=\"createVariant\" _click=\"\\${this.createShowcase}\">Create new showcase</button>\n      <div id=\"showcases\" data-sifrr-repeat=\"\\${this.state.showcases}\">\n        <li class=\"font showcase small \\${(this.root && this.state.name === this.root.state.currentSC.name) ? 'current' : ''}\" data-showcase-id=\"\\${this.state.key}\" draggable=\"true\">\\${this.state.name}<span>X</span></li>\n      </div>\n    </div>\n  </div>\n  <sifrr-single-showcase _update=\\${this.saveShowcase} _state=\\${this.state.currentSC} data-sifrr-bind=\"currentSC\"></sifrr-single-showcase>\n</div>"]);
    _templateObject$2 = function () {
      return data;
    };
    return data;
  }
  const template$2 = SifrrDom.template(_templateObject$2(), css);
  const storage = new SifrrStorage({
    name: 'showcases',
    version: '1.0'
  });
  class SifrrShowcase extends SifrrDom.Element {
    static get template() {
      return template$2;
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
      i = Number(i);
      this.current = i;
      this.$('#showcases').children[this.state.current].classList.remove('current');
      if (!this.state.showcases[i]) i = this.state.showcases.length - 1;
      this.state = {
        current: i,
        currentSC: this.state.showcases[i]
      };
      this.$('#showcases').children[i].classList.add('current');
      setParam('showcase', i);
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
      this._url = getParam('url') || this.$('#url').value;
      window.fetch(this._url).then(resp => resp.json()).then(v => {
        this.state.showcases = v.showcases;
        this.switchShowcase(getParam('showcase') === undefined ? v.current : getParam('showcase'));
        this.$('#status').textContent = 'loaded from url!';
      }).catch(e => {
        this.$('#status').textContent = e.message;
        storage.all().then(v => {
          this.$('#status').textContent = 'failed to load from url, loaded from storage!';
          this._loaded = true;
          if (Array.isArray(v.showcases)) {
            this.state.showcases = v.showcases;
            this.switchShowcase(getParam('showcase') === undefined ? v.current : getParam('showcase'));
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

  return SifrrShowcase;

}));
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrshowcase.js.map
