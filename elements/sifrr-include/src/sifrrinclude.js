import SifrrDom from '@sifrr/dom';

class SifrrInclude extends SifrrDom.Element {
  static syncedAttrs() {
    return ['url', 'type', 'selector'];
  }

  onConnect() {
    let preffix = '',
      suffix = '';
    if (this.type === 'js') {
      preffix = '<script>';
      suffix = '</script>';
    } else if (this.type === 'css') {
      preffix = '<style>';
      suffix = '</style>';
    } else {
      this.type = 'html';
    }

    if (this.url) {
      fetch(this.url)
        .then(r => r.text())
        .then(text => {
          if (this.type === 'html' && this.selector) {
            const template = SifrrDom.template(text);
            this.textContent = '';
            this.appendChild(template.content.querySelector(this.selector));
          } else this.innerHTML = preffix + text + suffix;
        });
    }
  }
}

SifrrDom.register(SifrrInclude);

export default SifrrInclude;
