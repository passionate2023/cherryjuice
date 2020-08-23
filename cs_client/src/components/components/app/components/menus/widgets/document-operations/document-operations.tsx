import { modDocumentOperations } from '::sass-modules';
import * as React from 'react';
import { useState } from 'react';
import { Header } from './components/header/header';
import { Body } from './components/body/body';
import { useGetActiveOperations } from './hooks/get-active-operations';
import { useGetPreviousOperations } from './hooks/get-previous-operations';
import { connect, ConnectedProps } from 'react-redux';

import { Store } from '::store/store';

const mapState = (state: Store) => ({
  imports: Object.values(state.documentOperations.imports),
  exports: Object.values(state.documentOperations.exports),
  user: state.auth.user,
});
const mapDispatch = {};
const connector = connect(mapState, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = {};
const DocumentOperations: React.FC<Props & PropsFromRedux> = ({
  imports,
  exports,
  user,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed(!collapsed);

  useGetPreviousOperations();
  useGetActiveOperations(user?.id);

  return imports.length || exports.length ? (
    <div
      className={`${modDocumentOperations.documentOperations} ${
        collapsed ? modDocumentOperations.documentOperationsCollapsed : ''
      }`}
    >
      <Header
        toggleCollapsed={toggleCollapsed}
        imports={imports}
        exports={exports}
        collapsed={collapsed}
      />
      <Body imports={imports} exports={exports} />
    </div>
  ) : (
    <></>
  );
};
const _ = connector(DocumentOperations);
export default _;
