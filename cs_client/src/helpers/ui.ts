import { modToolbar } from '::sass-modules/index';

const scrollIntoToolbar = () => {
  // on mobile, scrolling the node into view causes toolbar to get invisible
  const toolbar = document.querySelector('.' + modToolbar.toolBar);
  toolbar.scrollIntoView();
};

export { scrollIntoToolbar };
