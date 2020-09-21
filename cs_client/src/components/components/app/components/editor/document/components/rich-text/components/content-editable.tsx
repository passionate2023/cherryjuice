import { modRichText } from '::sass-modules';
import { default as React, useContext, useEffect, useRef } from 'react';
import { useReactRouterForAnchors } from '::root/components/app/components/editor/document/components/rich-text/hooks/react-router-for-anchors';
import { useAttachImagesToHtml } from '::root/components/app/components/editor/document/components/rich-text/hooks/get-node-images';
import { useHandleContentChanges } from '::root/components/app/components/editor/document/components/rich-text/hooks/handle-content-changes';
import { useAddMetaToPastedImages } from '::root/components/app/components/editor/document/components/rich-text/hooks/add-meta-to-pasted-images';
import { DocumentContext } from '::root/components/app/components/editor/document/reducer/context';
import { Image } from '::types/graphql/generated';
import { snapBackManager } from '::root/components/app/components/editor/tool-bar/components/groups/main-buttons/undo-redo/undo-redo';
import { useScrollToHashElement } from '::hooks/use-scroll-to-hash-element';
import { NodeScrollPosition } from '::store/ducks/cache/document-cache';

type Props = {
  contentEditable;
  html: string;
  nodeId;
  file_id;
  node_id;
  processLinks;
  isDocumentOwner: boolean;
  fetchNodeStarted: boolean;
  isOnMd: boolean;
  images: Image[];
  scrollPosition: NodeScrollPosition;
};

const ContentEditable = ({
  contentEditable,
  html,
  nodeId,
  file_id,
  node_id,
  processLinks,
  isDocumentOwner,
  images,
  fetchNodeStarted,
  isOnMd,
  scrollPosition,
}: Props) => {
  const ref = useRef<HTMLDivElement>();
  const { pastedImages } = useContext(DocumentContext);
  useHandleContentChanges({ node_id, documentId: file_id, ref });
  useAddMetaToPastedImages({ requestId: pastedImages });
  useAttachImagesToHtml({
    node_id,
    file_id,
    nodeId,
    html,
    images,
  });
  useScrollToHashElement();

  useReactRouterForAnchors({
    file_id,
    processLinks: processLinks,
    node_id,
    fetchNodeStarted,
  });
  useEffect(() => {
    if (snapBackManager.current) {
      snapBackManager.current.reset();
      snapBackManager.current.enable(1000);
    }
    if (!isOnMd) {
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
      ref={ref}
      key={node_id}
      className={modRichText.richText}
      contentEditable={contentEditable && isDocumentOwner}
      dangerouslySetInnerHTML={{ __html: html }}
      data-id={nodeId}
      data-node_id={node_id}
      data-document-id={file_id}
      id={'rich-text'}
    />
  );
};

export { ContentEditable };
