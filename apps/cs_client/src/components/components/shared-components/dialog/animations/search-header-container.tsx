import * as React from 'react';
import { modSearchDialog } from '::sass-modules';
import { joinClassNames } from '@cherryjuice/shared-helpers';
import { memo } from 'react';

const SearchHeaderContainer: React.FC<{ alignChildren?: 'h' | 'v' }> = ({
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

const M = memo(SearchHeaderContainer);
export { M as SearchHeaderContainer };

const SearchHeaderGroup: React.FC = ({ children }) => (
  <div className={modSearchDialog.searchDialog__header__group}>{children}</div>
);

const M2 = memo(SearchHeaderGroup);
export { M2 as SearchHeaderGroup };
