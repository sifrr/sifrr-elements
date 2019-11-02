import { Store } from '@sifrr/dom';

class ShowcaseStore extends Store {
  constructor(v) {
    super({
      active: 0,
      values: v || []
    });
  }

  setValues(values, active) {
    this.value.values = values || [];
    this.setActive(active || 0);
  }

  getValues() {
    return this.value.values;
  }

  bindUpdate(prop) {
    return (v => this.setActiveValue({ [prop]: v })).bind(this);
  }

  delete(index) {
    this.value.values.splice(index, 1);
    if (index !== this.value.active) this.setActive(this.value.active - 1);
    else this.update();
  }

  add(v) {
    this.value.values.splice(this.value.active + 1, 0, v);
    this.setActive(this.value.active + 1);
  }

  setActive(active) {
    this.value.values.forEach((v, i) => {
      if (i === active) v.active = true;
      else v.active = false;
    });
    this.set({ active });
  }

  getActiveValue() {
    return this.value.values[this.value.active] || {};
  }

  setActiveValue(v) {
    if (this.value.values[this.value.active]) {
      Object.assign(this.value.values[this.value.active], v);
      this.update();
    }
  }
}

export default ShowcaseStore;