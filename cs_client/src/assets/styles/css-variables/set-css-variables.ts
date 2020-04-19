const root = document.documentElement;
const cssVariables = {
  setVH: () => {
    root.style.setProperty('--vh', window.innerHeight + 'px');
  },
  setVW: () => {
    root.style.setProperty('--vw', window.innerWidth + 'px');
  },

  setOverlayWidth: (x: number) => {
    root.style.setProperty('--overlay-width', `${x}px`);
  },
  setOverlayLeft: (x: number) => {
    root.style.setProperty('--overlay-left', `-${x}px`);
  },
  setTreeWidth: (x: number) => {
    root.style.setProperty('--tree-width', `${x}px`);
  },
  setFormattingBar: (x: number) => {
    root.style.setProperty('--formatting-bar', `${x}px`);
  },
};

export { cssVariables };
