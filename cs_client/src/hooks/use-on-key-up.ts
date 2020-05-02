import { useEffect } from 'react';

const useOnKeyPress = ({
  elementSelector,
  onClick,
  keys = { Space: true, Enter: true, Tab: false },
}) => {
  useEffect(() => {
    const element = document.querySelector(elementSelector);
    const eventHandler = e => {
      if (keys[e.code]) {
        onClick();
      }
    };
    element.addEventListener('keyup', eventHandler);
    return () => {
      element.removeEventListener('keyup', eventHandler);
    };
  }, []);
};

export { useOnKeyPress };
