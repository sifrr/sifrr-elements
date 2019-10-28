import SifrrStorage from '@sifrr/storage';

import SwitchingStore from './switchingstore';
import { getParam, setParam } from '../../../helpers/urlparams';

const storage = new SifrrStorage({ name: 'showcases', version: '1.1' });
const showcaseStore = new SwitchingStore([]);
const variantStore = new SwitchingStore([]);

showcaseStore.fetchStore = function(url, onStatus) {
  window
    .fetch(url)
    .then(resp => resp.json())
    .then(v => {
      this.setValues(v.showcases);
      this.setActive(v.active || 0);
      onStatus('loaded from url!');
    })
    .catch(e => {
      onStatus(e.message);
      storage.all().then(v => {
        onStatus('failed to load from url, loaded from storage!');
        if (Array.isArray(v.showcases)) {
          this.setValues(v.showcases);
          this.setActive(v.active || 0);
        }
      });
    })
    .finally(() => {
      this._loaded = true;
      this.setActiveShowcase(
        getParam('showcase') === undefined ? v.activeShowcase : getParam('showcase')
      );
    });
};

showcaseStore.save = function(onUpdate) {
  storage.set(this.value).then(onUpdate);
};

showcaseStore.onUpdate = function() {
  setParam('showcase', this.value.active);
  console.log(this.getActiveValue().variants);
  if (
    this.getActiveValue().variants &&
    this.getActiveValue().variants !== variantStore.getValues()
  ) {
    variantStore.setValues(this.getActiveValue().variants);
  }

  this.onStatus('saving locally!');
  if (this._timeout) clearTimeout(this._timeout);
  this._timeout = setTimeout(() => {
    this._timeout = null;
    storage.set(this.value).then(() => {
      this.onStatus('saved locally!');
    });
  }, 500);
};

variantStore.onUpdate = function() {
  setParam('variant', this.value.active);
  showcaseStore.onUpdate();
};

export { showcaseStore, variantStore };
