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
showcaseStore.addListener(function(me) {
  if (getParam('showcase') != me.value.active) setParam('showcase', me.value.active);
  if (me.getActiveValue().variants && me.getActiveValue().variants !== variantStore.getValues()) {
    variantStore.setValues(me.getActiveValue().variants, me.getActiveValue().activeVariant);
  }

  if (me.getActiveValue().activeVariant !== variantStore.value.active) {
    me.getActiveValue().activeVariant = variantStore.value.active;
  }

  if (!me.getValues() || me.getValues().length < 1) return;

  me.onStatus('saving locally!');
  if (me._timeout) clearTimeout(me._timeout);
  me._timeout = setTimeout(saveFxn, 500);
});

variantStore.addListener(function(me) {
  if (getParam('variant') != me.value.active) setParam('variant', me.value.active);
  showcaseStore.onUpdate();
});

export { showcaseStore, variantStore };
