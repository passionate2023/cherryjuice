import * as React from 'react';

type Props = { length: number };

const Tab: React.FC<Props>[]= ({ length }) => {
  return Array.from({length}).map(() =>
    Array.from({ length: 4 }).map((_, i) => (
      <React.Fragment key={i}>&nbsp;</React.Fragment>
    ))
  );
};

export { Tab };
