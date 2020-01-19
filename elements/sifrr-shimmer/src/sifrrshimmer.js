import { Element, register } from '@sifrr/dom';

import style from './style';

function rgbToHsl(r = 0, g = 0, b = 0) {
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
}

class SifrrShimmer extends Element {
  onPropChange(prop) {
    if (['color', 'bg-color', 'fg-color'].indexOf(prop) > -1) this.update();
  }

  static get template() {
    return style;
  }

  getBgColor() {
    return this['bg-color'] || this.colora(0.15);
  }

  getFgColor() {
    return this['fg-color'] || this.colora(0);
  }

  colora(point) {
    const hsl = rgbToHsl(
      ...(this.color || '170, 170, 170')
        .replace(/ /g, '')
        .split(',')
        .map(Number)
    );
    const l = Math.min(hsl[2] + (this.isLight() ? point : -1 * point), 1);
    return `hsl(${hsl[0] * 359}, ${hsl[1] * 100}%, ${l * 100}%)`;
  }

  isLight() {
    return this.hasAttribute('light');
  }
}

register(SifrrShimmer);

export default SifrrShimmer;
