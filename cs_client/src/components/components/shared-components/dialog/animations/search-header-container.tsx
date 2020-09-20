import * as React from 'react';
import { modSearchDialog } from '::sass-modules';

export const SearchHeaderContainer: React.FC = ({ children }) => (
  <div className={modSearchDialog.searchDialog__header}>{children}</div>
);
