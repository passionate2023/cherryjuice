import { modRichText } from '::sass-modules';
import { default as React, useContext, useEffect, useRef } from 'react';
import { useAttachImagesToHtml } from '::editor/components/content-editable/hooks/attach-images-to-html';
import { useFlagEditedNode } from '::editor/components/content-editable/hooks/flag-edited-node';
import { useAddMetaToPastedImages } from '::editor/components/content-editable/hooks/add-meta-to-pasted-images';
import { DocumentContext } from '::root/components/app/components/editor/document/reducer/context';
import { Image } from '@cherryjuice/graphql-types';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';

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
  const { pastedImages } = useContext(DocumentContext);
  useFlagEditedNode({ node_id, documentId, ref });
  useAddMetaToPastedImages({ requestId: pastedImages });
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
      className={modRichText.richText}
      data-node_id={node_id}
      data-document-id={documentId}
      contentEditable={contentEditable}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export { ContentEditable };
