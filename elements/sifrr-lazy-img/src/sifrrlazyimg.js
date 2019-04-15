import SifrrDom from '@sifrr/dom';

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

export default SifrrLazyImg;
