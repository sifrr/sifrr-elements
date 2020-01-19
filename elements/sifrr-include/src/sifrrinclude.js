import { Element, register, Loader } from '@sifrr/dom';

class SifrrInclude extends Element {
  onPropChange(prop) {
    if (['type', 'url', 'selector'].indexOf(prop) > -1) this.load();
  }

  load() {
    let element = false;
    if (this.type === 'js') {
      element = 'script';
      Loader.executeJS(this.url);
    } else if (this.type === 'css') {
      element = 'style';
    } else {
      this.type = 'html';
    }

    if (this.url) {
      fetch(this.url)
        .then(r => r.text())
        .then(text => {
          if (this.type === 'html' && this.selector) {
            const template = document.createElement('template');
            template.innerHTML = text;
            this.textContent = '';
            this.appendChild(template.content.querySelector(this.selector));
          } else
            this.innerHTML = `${element ? `<${element}>` : ''}${text}${
              element ? `</${element}>` : ''
            }`;
        });
    }
  }
}

register(SifrrInclude);

export default SifrrInclude;
