import * as React from 'react';
import { useState, useCallback } from 'react';
import modules from '../assets/styles/modules/app.css'
type Props = {};



const App = (props: Props) => {
  const [mounted, mount] = useState(true);
  const toggle = useCallback(
    () => {
      mount(!mounted);
    },
    [mounted]
  );

  return (
    <div>
      <button className={modules.togglechildren} onClick={toggle}>
        {mounted ? 'unmount' : 'mount'}
      </button>
      {mounted && <div>hello world</div>}
    </div>
  );
};

export { App };
