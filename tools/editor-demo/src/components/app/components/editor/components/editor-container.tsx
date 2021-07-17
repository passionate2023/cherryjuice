import * as React from 'react';
import { ContentEditableProps, Editor } from '@cherryjuice/editor';
import { Image } from '@cherryjuice/graphql-types';
import { NodeProps } from '::root/app/components/editor/components/tabs/components/tab';

export type Node = {
  content: { html: string; images: Image[] };
  meta: Pick<NodeProps, 'name' | 'node_id'> & { documentId: string };
};

type Props = { demo: Node };

export const EditorContainer: React.FC<Props> = ({ demo }) => {
  const contentEditableProps: ContentEditableProps = {
    editable: true,
    focusOnUpdate: true,
    html: demo.content.html,
    images: demo.content.images,
    nodeId: demo.meta.documentId + '/' + demo.meta.node_id,
    scrollPosition: [0, 0],
  };
  return (
    <Editor
      contentEditableProps={contentEditableProps}
      gestureHandlerProps={{}}
      loading={false}
      fallbackComponent={undefined}
    />
  );
};
