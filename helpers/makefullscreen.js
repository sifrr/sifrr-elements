import animate from '@sifrr/animate';

const styles = ['position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'z-index'];
const FS_CLASS = 'fs';

function getNewProps(rect) {
  const ans = {};
  styles.forEach(s => {
    if (s === 'position') {
      ans[s] = 'fixed';
    } else if (s === 'z-index') {
      ans[s] = '999';
    } else {
      ans[s] = rect[s] + 'px';
    }
  });
  return ans;
}

function makeFullScreen(element, onUpdate) {
  const rect = element.getBoundingClientRect();
  const newProps = getNewProps(rect);
  const clone = element.cloneNode(true);
  for (let prop in newProps) {
    element[`__o${prop}`] = element.style[prop];
    element[`__n${prop}`] = newProps[prop];
    element.style[prop] = newProps[prop];
  }
  element.insertAdjacentElement('afterend', clone);
  element.___clone = clone;
  element.classList.add(FS_CLASS);

  return animate({
    target: element.style,
    to: {
      left: '0px',
      top: '0px',
      width: window.innerWidth + 'px',
      height: window.innerHeight + 'px'
    },
    onUpdate
  });
}

function exitFullScreen(element, onUpdate) {
  return animate({
    target: element.style,
    to: {
      left: element.__nleft,
      top: element.__ntop,
      width: element.__nwidth,
      height: element.__nheight
    },
    onUpdate
  }).then(() => {
    element.___clone.remove();
    styles.forEach(s => {
      element.style[s] = element[`__o${s}`];
      delete element[`__o${s}`];
      delete element[`__n${s}`];
    });
    element.classList.remove(FS_CLASS);
  });
}

function toggleFullScreen(element, onUpdate) {
  if (element.classList.contains(FS_CLASS)) {
    exitFullScreen(element, onUpdate);
  } else {
    makeFullScreen(element, onUpdate);
  }
}

export { makeFullScreen, exitFullScreen, toggleFullScreen };
