import SifrrStorage from '@sifrr/storage';

import SwitchingStore from './switchingstore';
import { getParam, setParam } from '../../../helpers/urlparams';

const storage = new SifrrStorage({ name: 'showcases', version: '1.1' });
const showcaseStore = new SwitchingStore([]);
const variantStore = new SwitchingStore([]);

showcaseStore.fetchStore = function(url, onStatus = () => {}) {
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
        if (Array.isArray(v.values)) {
          this.setValues(v.values);
          this.setActive(v.active || 0);
        }
      });
    })
    .finally(() => {
      this._loaded = true;
      this.setActive(getParam('showcase') === undefined ? 0 : getParam('showcase'));
    });
};

showcaseStore.save = function(onUpdate) {
  storage.set(this.value).then(onUpdate);
};

const saveFxn = showcaseStore.save.bind(
  showcaseStore,
  () => showcaseStore.onStatus('saved locally!'),
  (showcaseStore._timeout = null)
);
showcaseStore.onUpdate = function() {
  if (getParam('showcase') != this.value.active) setParam('showcase', this.value.active);
  if (
    this.getActiveValue().variants &&
    this.getActiveValue().variants !== variantStore.getValues()
  ) {
    variantStore.setValues(this.getActiveValue().variants, this.getActiveValue().activeVariant);
  }

  if (this.getActiveValue().activeVariant !== variantStore.value.active) {
    this.getActiveValue().activeVariant = variantStore.value.active;
  }

  if (!this.getValues() || this.getValues().length < 1) return;

  this.onStatus('saving locally!');
  if (this._timeout) clearTimeout(this._timeout);
  this._timeout = setTimeout(saveFxn, 500);
};

variantStore.onUpdate = function() {
  if (getParam('variant') != this.value.active) setParam('variant', this.value.active);
  showcaseStore.onUpdate();
};

export { showcaseStore, variantStore };
