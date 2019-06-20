import animate from '@sifrr/animate';

const styles = [ 'position', 'left', 'top', 'width', 'height', 'z-index'];
const FS_CLASS = 'fs';

function getNewProps(rect) {
  const ans = {};
  styles.forEach(s => {
    if (s === 'position') {
      ans[s] = 'fixed';
    } else if (s === 'z-index') {
      ans[s] = '99999';
    } else {
      ans[s] = rect[s] + 'px';
    }
  });
  return ans;
}

function makeFullScreen(element, onUpdate) {
  const rect = element.getBoundingClientRect();
  const newProps = getNewProps(rect);
  for (let prop in newProps) {
    element[`__o${prop}`] = element.style[prop];
    element[`__n${prop}`] = newProps[prop];
    element.style[prop] = newProps[prop];
  }
  return animate({
    target: element.style,
    to: {
      left: '0px',
      top: '0px',
      width: window.innerWidth + 'px',
      height: window.innerHeight + 'px',
    },
    onUpdate
  }).then(() => element.classList.add(FS_CLASS));
}

function exitFullScreen(element, onUpdate) {
  element.classList.remove(FS_CLASS);
  return animate({
    target: element.style,
    to: {
      left: element.__nleft,
      top: element.__ntop,
      width: element.__nwidth,
      height: element.__nheight,
    },
    onUpdate
  }).then(() => {
    styles.forEach(s => {
      element.style[s] = element[`__o${s}`];
      delete element[`__o${s}`];
      delete element[`__n${s}`];
    });
  });
}

export {
  makeFullScreen,
  exitFullScreen
};
