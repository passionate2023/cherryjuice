import { modDocumentOperations } from '::sass-modules';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Header } from './components/header/header';
import { Body } from './components/body/body';
import { DocumentSubscription } from '::types/graphql/generated';

type Props = {
  imports: DocumentSubscription[];
  exports: DocumentSubscription[];
};

const DocumentOperations: React.FC<Props> = ({ imports, exports }) => {
  const ref = useRef<HTMLDivElement>();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => void setCollapsed(!collapsed);

  useEffect(() => {
    ref.current.parentElement.style.height = collapsed ? '40px' : 'auto';
  }, [collapsed, imports.length, exports.length]);
  return imports.length || exports.length ? (
    <div
      className={`${modDocumentOperations.documentOperations} ${
        collapsed ? modDocumentOperations.documentOperationsCollapsed : ''
      }`}
      ref={ref}
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
const _ = React.memo(DocumentOperations);
export { _ as DocumentOperations };
