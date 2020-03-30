const root = document.documentElement;
const cssVariables = {
  setVH: () => {
    root.style.setProperty('--vh', window.innerHeight + 'px');
  },
  setVW: () => {
    root.style.setProperty('--vw', window.innerWidth + 'px');
  },
};

export { cssVariables };
