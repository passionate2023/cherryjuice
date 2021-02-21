import * as React from 'react';
import { CSSProperties } from 'react';

const blockBackgroundFullSize: CSSProperties = {
  backgroundColor: 'var(--void)',
  display: 'block',
  width: '100%',
  height: '100%',
};

const fallbackStyles = {
  blockBackgroundFullSize,
};

type Props = {
  style?: keyof typeof fallbackStyles;
};

const Void: React.FC<Props> = ({ style }) => {
  return <span style={fallbackStyles[style]} />;
};

export { Void };
