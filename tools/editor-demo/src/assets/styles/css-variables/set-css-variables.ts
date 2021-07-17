const root = document.documentElement;
const cssVariables = {
  setVariable: (variableName: string, value: string) => {
    root.style.setProperty('--' + variableName, value);
  },
  setProperty: (propertyName: string) => (value: number) =>
    root.style.setProperty('--' + propertyName, value + 'px'),
  getProperty: (propertyName: string) => () =>
    root.style.getPropertyValue('--' + propertyName),

  setOverlayWidth: (x: number) => {
    root.style.setProperty('--overlay-width', `${x}px`);
  },
  setOverlayLeft: (x: number) => {
    root.style.setProperty('--overlay-left', `-${x}px`);
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
  setRecentNodes: (x: number) => {
    root.style.setProperty('--recent-nodes', `${x}px`);
  },
  setDockedDialogHeight(vh: number) {
    root.style.setProperty('--docked-dialog-height', `${vh}vh`);
  },
};

export { cssVariables };
