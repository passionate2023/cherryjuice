import * as React from 'react';
import { CSSProperties } from 'react';

const blockBackgroundFullSize: CSSProperties = {
  backgroundColor: 'var(--void)',
  display: 'block',
  width: '100%',
  height: '100%',
};

const Void: React.FC = () => {
  return <span style={blockBackgroundFullSize} />;
};

export { Void };
