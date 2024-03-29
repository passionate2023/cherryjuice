import { MutableRefObject, useEffect } from 'react';

type KeyCodes = 'Space' | 'Enter' | 'Tab' | 'Escape';
const defaultKeys: KeyCodes[] = ['Space', 'Enter'];
const useOnKeyPress = ({
  ref,
  onClick,
  keys = defaultKeys,
}: {
  ref: MutableRefObject<HTMLElement>;
  onClick: (e: KeyboardEvent) => void;
  keys?: KeyCodes[];
}) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const eventHandler = e => {
      if (keys.includes(e.code)) {
        onClick(e);
      }
    };
    element.addEventListener('keyup', eventHandler);
    return () => {
      element.removeEventListener('keyup', eventHandler);
    };
  }, [ref.current, onClick, keys]);
};

export { useOnKeyPress };
