import { useEffect } from 'react';

const createEventHandler = ({ selectorsToIgnore, cb, isVisible }) => e => {
  const selectors = selectorsToIgnore.join(', ');
  if (isVisible && !e.target.closest(selectors)) {
    cb();
  }
};
const useClickOutsideModal = ({ selectorsToIgnore, cb, isVisible = true }) => {
  useEffect(() => {
    const handler = createEventHandler({ selectorsToIgnore, cb, isVisible });
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [isVisible]);
};

export { useClickOutsideModal };
