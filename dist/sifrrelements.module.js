/*! SifrrElements v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr */
import SifrrDom from '@sifrr/dom';

function moveAttr(el, attr) {
  if (!el.dataset[attr]) return;
  el.setAttribute(attr, el.dataset[attr]);
  el.removeAttribute(`data-${attr}`);
}
function loadPicture(pic) {
  if (pic.sifrrLazyLoaded) return false;
  pic.sifrrLazyLoaded = true;
  pic.$$('source', false).forEach((s) => {
    moveAttr(s, 'srcset');
  });
  const img = pic.$('img', false);
  moveAttr(img, 'src');
  return true;
}
class SifrrLazyPicture extends Sifrr.Dom.Element.extends(HTMLPictureElement) {
  static useShadowRoot() {
    return true;
  }
  static get observer() {
    this._observer = this._observer || new IntersectionObserver(this.onVisible, {
      rootMargin: this.rootMargin
    });
    return this._observer;
  }
  static onVisible(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        SifrrLazyPicture.observer.unobserve(entry.target);
        loadPicture(entry.target);
      }
    });
  }
  onConnect() {
    this.sifrrLazyLoaded = false;
    this.constructor.observer.observe(this);
  }
  onDisconnect() {
    this.constructor.observer.unobserve(this);
  }
}
SifrrLazyPicture.rootMargin = '0px 0px 200px 0px';
if (window) SifrrDom.register(SifrrLazyPicture, { extends: 'picture' });



const sifrrstater = /*#__PURE__*/Object.freeze({

});



const sifrrtabs = /*#__PURE__*/Object.freeze({

});

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}

const require$$2 = getCjsExportFromNamespace(sifrrtabs);

var sifrrelements = {
  SifrrLazyPicture: SifrrLazyPicture,
  SifrrStater: sifrrstater,
  SifrrTabs: require$$2
};
var sifrrelements_1 = sifrrelements.SifrrLazyPicture;
var sifrrelements_2 = sifrrelements.SifrrStater;
var sifrrelements_3 = sifrrelements.SifrrTabs;

export default sifrrelements;
export { sifrrelements_1 as SifrrLazyPicture, sifrrelements_2 as SifrrStater, sifrrelements_3 as SifrrTabs };
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrelements.module.js.map
