import { default as React, useEffect, useRef } from 'react';
import { useAttachImagesToHtml } from '::root/components/content-editable/hooks/attach-images-to-html';
import { useFlagEditedNode } from '::root/components/content-editable/hooks/flag-edited-node';
import { Image } from '@cherryjuice/graphql-types';
import { snapBackManager } from '::root/snapback-manager';
import { modEditor } from '::sass-modules';

export type ContentEditableProps = {
  contentEditable;
  html: string;
  documentId: string;
  node_id: number;
  focusOnUpdate: boolean;
  images: Image[];
  scrollPosition: [number, number];
};

const ContentEditable = ({
  contentEditable,
  html,
  documentId,
  node_id,
  images,
  focusOnUpdate,
  scrollPosition,
}: ContentEditableProps) => {
  const ref = useRef<HTMLDivElement>();
  useFlagEditedNode({ node_id, documentId, ref });
  useAttachImagesToHtml({
    node_id,
    html,
    images,
  });

  useEffect(() => {
    if (snapBackManager.current) {
      snapBackManager.current.reset();
      snapBackManager.current.enable(1000);
    }
    if (focusOnUpdate) {
      ref.current.focus();
    }
  }, [html]);
  useEffect(() => {
    if (scrollPosition) {
      ref.current.scrollTo(...scrollPosition);
    }
  }, [node_id]);

  return (
    <div
      key={node_id}
      ref={ref}
      id={'rich-text'}
      className={modEditor.editor__contentEditable}
      data-node_id={node_id}
      data-document-id={documentId}
      contentEditable={contentEditable}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export { ContentEditable };
