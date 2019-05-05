/*! SifrrLazyImg v0.0.4 - sifrr project | MIT licensed | https://github.com/sifrr/sifrr-elements */
import SifrrDom from '@sifrr/dom';

function moveAttr(el, attr) {
  if (!el.dataset[attr]) return;
  el.setAttribute(attr, el.dataset[attr]);
  el.removeAttribute(`data-${attr}`);
}
function loadPicture(pic) {
  if (pic.tagName === 'PICTURE') {
    pic.querySelectorAll('source').forEach((s) => {
      moveAttr(s, 'src');
      moveAttr(s, 'srcset');
    });
    pic = pic.querySelector('img');
  } else if (pic.tagName !== 'IMG') {
    throw Error('LazyLoader only supports `picture` or `img` element. Given: ', pic);
  }
  moveAttr(pic, 'src');
  moveAttr(pic, 'srcset');
  return true;
}
function onVisible(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target._loaded) {
      entry.target._loaded = true;
      if (entry.target.beforeLoad) entry.target.beforeLoad();
      loadPicture(entry.target);
      this.unobserve(entry.target);
      if (entry.target.afterLoad) entry.target.afterLoad();
    }
  });
}
class LazyLoader extends window.IntersectionObserver {
  constructor(rootMargin = '0px 0px 0px 0px') {
    super(onVisible, { rootMargin });
  }
}
LazyLoader.prototype._observe = LazyLoader.prototype.observe;
LazyLoader.prototype.observe = function(el) {
  el._loaded = false;
  this._observe(el);
};
var lazyloader = LazyLoader;

class SifrrLazyImg extends SifrrDom.Element.extends(HTMLImageElement) {
  static get observer() {
    this._observer = this._observer || new lazyloader(this.rootMargin);
    return this._observer;
  }
  onConnect() {
    this.reload();
  }
  reload() {
    this.constructor.observer.observe(this);
  }
  onDisconnect() {
    this.constructor.observer.unobserve(this);
  }
}
SifrrLazyImg.rootMargin = '0px 0px 50px 0px';
SifrrDom.register(SifrrLazyImg, { extends: 'img' });

export default SifrrLazyImg;
/*! (c) @aadityataparia */
//# sourceMappingURL=sifrrlazyimg.module.js.map
