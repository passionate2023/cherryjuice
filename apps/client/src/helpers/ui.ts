import { modToolbar } from '::sass-modules';
import { smoothScrollIntoView } from '@cherryjuice/shared-helpers';

const scrollIntoToolbar = () => {
  // on mobile, scrolling the node into view causes toolbar to get invisible
  const toolbar = document.querySelector('.' + modToolbar.toolBar);
  if (toolbar) smoothScrollIntoView(toolbar);
};

export { scrollIntoToolbar };
