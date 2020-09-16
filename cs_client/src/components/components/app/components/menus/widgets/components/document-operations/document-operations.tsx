import { modDocumentOperations } from '::sass-modules';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Header } from './components/header/header';
import { Body } from './components/body/body';
import { DocumentOperation } from '::types/graphql/generated';

type Props = {
  operations: DocumentOperation[];
};

const DocumentOperations: React.FC<Props> = ({ operations }) => {
  const ref = useRef<HTMLDivElement>();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => void setCollapsed(!collapsed);

  useEffect(() => {
    ref.current.parentElement.style.height = collapsed ? '40px' : 'auto';
  }, [collapsed, operations]);
  return operations.length ? (
    <div
      className={`${modDocumentOperations.documentOperations} ${
        collapsed ? modDocumentOperations.documentOperationsCollapsed : ''
      }`}
      ref={ref}
    >
      <Header
        toggleCollapsed={toggleCollapsed}
        operations={operations}
        collapsed={collapsed}
      />
      <Body operations={operations} />
    </div>
  ) : (
    <></>
  );
};
const _ = React.memo(DocumentOperations);
export { _ as DocumentOperations };
