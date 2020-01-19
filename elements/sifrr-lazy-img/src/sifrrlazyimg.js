import { Element, register } from '@sifrr/dom';
import LazyLoader from '../../../helpers/lazyloader';

class SifrrLazyImg extends Element.extends(HTMLImageElement) {
  static get observer() {
    this._observer = this._observer || new LazyLoader(this.rootMargin);
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

register(SifrrLazyImg, { extends: 'img' });

export default SifrrLazyImg;
