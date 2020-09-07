import { useState } from 'react';
import { useTransition } from 'react-spring';
import { Widget } from '::root/components/app/components/menus/widgets/widgets';

const config = { tension: 125, friction: 20, precision: 0.1 };

type HubTransitionProps = {
  widgets: Widget[];
};

const useHubTransition = ({ widgets }: HubTransitionProps) => {
  const [refMap] = useState(() => new WeakMap());
  // @ts-ignore
  const transitions = useTransition(widgets, item => item.key, {
    from: { opacity: 0, height: 0 },
    // @ts-ignore
    enter: item => async next =>
      await next({
        opacity: 1,
        height: Number(refMap.get(item).firstElementChild?.offsetHeight),
      }),
    leave: { height: 0, opacity: 0 },
    config,
  });
  const setRef = (item: JSX.Element) => ref => ref && refMap.set(item, ref);

  return { transitions, setRef };
};

export { useHubTransition };
