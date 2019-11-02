import SifrrDom from '@sifrr/dom';

class SifrrInclude extends SifrrDom.Element {
  onPropsChange(props) {
    if (props.filter(p => ['type', 'url', 'selector'].indexOf(p) > -1).length > 0) this.load();
  }

  load() {
    let element = false;
    if (this.type === 'js') {
      element = 'script';
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
            const template = SifrrDom.template(text);
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

SifrrDom.register(SifrrInclude);

export default SifrrInclude;
