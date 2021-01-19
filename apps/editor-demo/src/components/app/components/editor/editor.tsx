import * as React from 'react';
import {
  EditorContainer,
  Node,
} from '::root/app/components/editor/components/editor-container';
import { useEffect, useReducer } from 'react';
import { editorAC, editorR } from '::root/app/components/editor/reducer';
import { Toolbar } from '::root/app/components/editor/components/toolbar/toolbar';

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

      <EditorContainer demo={document.nodes[state.selected]} />
    </>
  );
};
