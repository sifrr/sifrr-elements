import { Store } from '@sifrr/template';

class ShowcaseStore extends Store {
  constructor(v) {
    super({
      active: -1,
      values: v || []
    });
  }

  setValues(values, active) {
    this.value.values = values || [];
    this.setActive(active || this.value.values.length - 1);
  }

  getValues() {
    return this.value.values;
  }

  bindUpdate(prop) {
    return ((v, el) => this.setActiveValue({ [prop]: el ? el.value : v })).bind(this);
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
      if (i === active) v.isActive = true;
      else v.isActive = false;
    });
    this.setAssign({ active });
  }

  getActiveValue() {
    return this.value.values[this.value.active] || {};
  }

  setActiveValue(v) {
    if (this.value.values[this.value.active]) {
      Object.assign(this.value.values[this.value.active], v);
      this.onUpdate();
    }
  }

  setAssign(newv) {
    this.set(Object.assign(this.value, newv));
  }
}

export default ShowcaseStore;
