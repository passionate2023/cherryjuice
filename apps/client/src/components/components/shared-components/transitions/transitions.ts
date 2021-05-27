const disableAnimations =
  localStorage.getItem('--disable-animations') === 'true';

const configs = {
  c1: {
    tension: 255,
    friction: 30,
  },
  c2: {
    tension: 220,
    friction: 14,
  },
};
const transitions = {
  t1: {
    from: { opacity: 0, xyz: [0, -25, 0.5] },
    enter: { opacity: 1, xyz: [0, 0, 1] },
    leave: { opacity: 0, xyz: [0, window.innerHeight * 0.5, 1] },
    config: configs.c1,
    unique: true,
  },
  t2: {
    from: { opacity: 0, xyz: [0, window.innerHeight * 0.25, 1, 0.5] },
    enter: { opacity: 1, xyz: [0, 0, 1] },
    leave: { opacity: 0, xyz: [0, window.innerHeight * 0.25, 1] },
    config: configs.c1,
    unique: true,
  },
  t3: {
    from: { opacity: 0, xy: [0, window.innerHeight * 0.7] },
    enter: { opacity: 1, xy: [0, 0] },
    leave: { opacity: 0.5, xy: [0, window.innerHeight * 1.1] },
    config: {
      tension: 170,
      unique: true,
    },
  },
};
if (disableAnimations) {
  const empty = { opacity: 1, xyz: [0, 0, 1], xy: [0, 0] };
  Object.entries(transitions).forEach(([, props]) => {
    props.from = empty;
    props.enter = empty;
    props.leave = empty;
  });
}

export { transitions, configs };
