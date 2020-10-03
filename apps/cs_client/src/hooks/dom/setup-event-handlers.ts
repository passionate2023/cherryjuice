import { useEffect } from 'react';

export type EventHandler = { type: string; listener: EventListener };
const useSetupEventHandlers = (
  selector: string,
  eventHandlers: EventHandler[],
) => {
  useEffect(() => {
    const target = document.querySelector(selector);
    eventHandlers.forEach(
      ({ type, listener }) => void target.addEventListener(type, listener),
    );
    return () => {
      eventHandlers.forEach(({ type, listener }) => {
        target.removeEventListener(type, listener);
      });
    };
  }, []);
};

export { useSetupEventHandlers };
