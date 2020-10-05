import { modToolbar } from '::sass-modules';
import { smoothScrollIntoView } from '::root/components/app/components/editor/document/components/title-and-recent-nodes/components/components/tab';

const scrollIntoToolbar = () => {
  // on mobile, scrolling the node into view causes toolbar to get invisible
  const toolbar = document.querySelector('.' + modToolbar.toolBar);
  smoothScrollIntoView(toolbar);
};

export { scrollIntoToolbar };
