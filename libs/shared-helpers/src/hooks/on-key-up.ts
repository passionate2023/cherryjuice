import { MutableRefObject, useEffect } from 'react';

type KeyCodes = 'Space' | 'Enter' | 'Tab';
const defaultKeys: KeyCodes[] = ['Space', 'Enter'];
const useOnKeyPress = ({
  ref,
  onClick,
  keys = defaultKeys,
}: {
  ref: MutableRefObject<HTMLElement>;
  onClick: () => void;
  keys?: KeyCodes[];
}) => {
  useEffect(() => {
    const element = ref.current;
    const eventHandler = e => {
      if (keys.includes(e.code)) {
        onClick();
      }
    };
    element.addEventListener('keyup', eventHandler);
    return () => {
      element.removeEventListener('keyup', eventHandler);
    };
  }, [ref.current, onClick, keys]);
};

export { useOnKeyPress };
