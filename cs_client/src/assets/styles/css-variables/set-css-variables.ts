const root = document.documentElement;
const cssVariables = {
  setProperty: (propertyName: string) => (value: number) =>
    root.style.setProperty('--' + propertyName, value + 'px'),
  getProperty: (propertyName: string) => () =>
    root.style.getPropertyValue('--' + propertyName),
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
  setInfoBar: (x: number) => {
    root.style.setProperty('--info-bar', `${x}px`);
  },
  setNodesBar: (x: number) => {
    root.style.setProperty('--nodes-bar', `${x}px`);
  },
  setDockedDialogHeight(vh: number) {
    root.style.setProperty('--docked-dialog-height', `${vh}vh`);
  },
};

export { cssVariables };
