const animations = {
  linear: [0, 0, 1, 1],
  ease: [.25, .1, .25, 1],
  easeIn: [.42, 0, 1, 1],
  easeOut: [0, 0, .58, 1],
  easeInOut: [.42, 0, .58, 1]
};

class Bezier {
  constructor(args){
    this.setProps(...args);
    return this.final.bind(this);
  }

  setProps(x1, y1, x2, y2) {
    let props = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      A: (aA1, aA2) => 1.0 - 3.0 * aA2 + 3.0 * aA1,
      B: (aA1, aA2) => 3.0 * aA2 - 6.0 * aA1,
      C: (aA1) => 3.0 * aA1,
      CalcBezier: (aT, aA1, aA2) => ((this.A(aA1, aA2)*aT + this.B(aA1, aA2))*aT + this.C(aA1))*aT,
      GetSlope: (aT, aA1, aA2) => 3.0 * this.A(aA1, aA2)*aT*aT + 2.0 * this.B(aA1, aA2) * aT + this.C(aA1)
    };
    Object.assign(this, props);
  }

  final(x) {
    if (this.x1 == this.y1 && this.x2 == this.y2) return x;
    return this.CalcBezier(this.GetTForX(x), this.y1, this.y2);
  }

  GetTForX(xx) {
    let t = xx;
    for (let i = 0; i < 4; ++i) {
      let slope = this.GetSlope(t, this.x1, this.x2);
      if (slope == 0.0) return t;
      let x = this.CalcBezier(t, this.x1, this.x2) - xx;
      t -= x / slope;
    }
    return t;
  }
}

function animate(who, what, to, time = 300, { type = 'ease', from } = {}) {
  let toBefore = to, preffix = false, suffix = false;
  if (typeof to === 'string') {
    [preffix, to, suffix] = to.split(/(\d+)(.*)?/).filter(s => s);
    [, from, ] = (from || who[what]).split(/(\d+)(.*)?/).filter(s => s);
    from = Number(from), to = Number(to);
  } else {
    from = who[what];
  }
  const diff = to - from;
  const animeFxn = new Bezier(animate.types[type] || type);
  let startTime;

  return new Promise(res => {
    function frame(currentTime) {
      startTime = startTime || currentTime;
      const percent = (currentTime - startTime) / time;
      if (percent >= 1) {
        who[what] = toBefore;
        return res();
      }
      let next = animeFxn(percent) * diff + from;
      if (!suffix && !preffix) who[what] = next;
      else who[what] = (preffix ? preffix : '') + next + (suffix ? suffix : '');
      window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  });
}

animate.types = animations;

export default animate;
