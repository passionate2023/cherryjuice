import * as React from 'react';
import { TabsContainer } from '::root/app/components/editor/components/tabs/tabs-container';
import {
  EditorContainer,
  Node,
} from '::root/app/components/editor/components/editor-container';
import { useEffect, useReducer } from 'react';
import { editorAC, editorR } from '::root/app/components/editor/reducer';
import { Toolbar } from '::root/app/components/toolbar/toolbar';

export type Document = {
  id: string;
  nodes: Record<number, Node>;
};

type Props = {
  document: Document;
};
export const Editor: React.FC<Props> = ({ document }) => {
  const [state, dispatch] = useReducer(editorR, undefined, () => ({
    selected: +Object.keys(document.nodes)[0],
  }));
  useEffect(() => {
    editorAC.init(dispatch);
  }, []);

  return (
    <>
      <Toolbar documentId={document.id} />
      <TabsContainer
        documentId={document.id}
        nodes={Object.values(document.nodes).map(node => ({
          node_id: node.meta.node_id,
          name: node.meta.name,
          isSelected: state.selected === node.meta.node_id,
          hasChanges: false,
          isBookmarked: false,
          isNew: false,
        }))}
        isOnMd={false}
      />
      <EditorContainer demo={document.nodes[state.selected]} />
    </>
  );
};
