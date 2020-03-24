let root = document.documentElement;
const cssVariables = {
  setVH: () => {
    root.style.setProperty('--vh', window.innerHeight + 'px');
  },
};

export { cssVariables };
