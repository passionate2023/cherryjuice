import * as React from 'react';
import { modDocumentOperations } from '::sass-modules';

export type HeaderTextProps = {
  text: string;
};

const HeaderText: React.FC<HeaderTextProps> = ({ text }) => {
  return (
    <span className={modDocumentOperations.collapsableList__header__text}>
      {text}
    </span>
  );
};

export { HeaderText };
