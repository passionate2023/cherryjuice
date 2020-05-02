import { useEffect } from 'react';

const createEventHandler = ({ selectorsToIgnore, cb }) => e => {
  if (!e.target.closest(selectorsToIgnore.join(', '))) {
    cb();
  }
};
const useClickOutsideModal = ({ selectorsToIgnore, cb }) => {
  useEffect(() => {
    const handler = createEventHandler({ selectorsToIgnore, cb });
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);
};

export { useClickOutsideModal };
