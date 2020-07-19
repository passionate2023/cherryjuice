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
  },
  t2: {
    from: { opacity: 0, xyz: [0, window.innerHeight * 0.25, 1, 0.5] },
    enter: { opacity: 1, xyz: [0, 0, 1] },
    leave: { opacity: 0, xyz: [0, window.innerHeight * 0.25, 1] },
    config: configs.c1,
  },
};

export { transitions, configs };
