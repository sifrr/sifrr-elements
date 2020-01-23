import { Element, register } from '@sifrr/dom';
import LazyLoader from '../../../helpers/lazyloader';

class SifrrLazyPicture extends Element.extends(HTMLPictureElement) {
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

SifrrLazyPicture.rootMargin = '0px 0px 50px 0px';

register(SifrrLazyPicture, { extends: 'picture' });

export default SifrrLazyPicture;
