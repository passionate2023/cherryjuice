import * as React from 'react';
import { useState, useCallback } from 'react';

type Props = {};

const style = {
  position: 'fixed',
  top: '5px',
  left: '5px',
  fontSize: ' 16px'
};

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
      <button style={style} onClick={toggle}>
        {mounted ? 'unmount' : 'mount'}
      </button>
      {mounted && <div>hello world</div>}
    </div>
  );
};

export { App };
