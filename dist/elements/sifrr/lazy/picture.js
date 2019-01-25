function loadPicture(pic) {
  if (pic.sifrrLazyLoaded) return false;
  pic.sifrrLazyLoaded = true;
  pic.$$('source', false).forEach((s) => {
    if (s.dataset.srcset) s.setAttribute('srcset', s.dataset.srcset);
  });
  const img = pic.$('img', false);
  if (img.dataset.src) img.setAttribute('src', img.dataset.src);
  return true;
}

//Sifrr Lazy Loading Picture
class SifrrLazyPicture extends Sifrr.Dom.Element.extends(HTMLPictureElement) {
  static noContent() {
    return true;
  }

  static useShadowRoot() {
    return true;
  }

  static get observer() {
    this._observer = this._observer || new IntersectionObserver(this.onVisible, {
      rootMargin: '0px 0px 200px 0px'
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

Sifrr.Dom.register(SifrrLazyPicture, { extends: 'picture' });
