import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { joinClassNames } from '::helpers/dom/join-class-names';

export const SearchHeaderContainer: React.FC<{ alignChildren?: 'h' | 'v' }> = ({
  children,
  alignChildren,
}) => (
  <div
    className={joinClassNames([
      modSearchDialog.searchDialog__header,
      [
        modSearchDialog.searchDialog__headerAlignVertically,
        alignChildren === 'v',
      ],
    ])}
  >
    {children}
  </div>
);

export const SearchHeaderGroup: React.FC = ({ children }) => (
  <div className={modSearchDialog.searchDialog__header__group}>{children}</div>
);
